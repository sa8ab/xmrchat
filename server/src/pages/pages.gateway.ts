import { forwardRef, Inject, Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { Payment } from 'src/payments/payment.entity';
import { Tip } from 'src/tips/tip.entity';
import { PagesService } from './pages.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { clearMessage } from 'src/shared/utils';
import { PricesService } from 'src/prices/prices.service';
import { MoneroUtils } from 'monero-ts';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FiatEnum } from 'src/shared/constants';
import { TipMessageService } from 'src/tip-message/tip-message.service';

@WebSocketGateway({ namespace: '/pages', cors: { origin: true } })
export class PagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(PagesGateway.name);

  constructor(
    @Inject(forwardRef(() => PagesService)) private pagesService: PagesService,
    @InjectRepository(Tip) private tipsRepo: Repository<Tip>,
    private pricesService: PricesService,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private tipMessageService: TipMessageService,
  ) {}

  @WebSocketServer()
  server: Namespace;

  async handleConnection(client: Socket) {
    const slug = client.handshake.auth.slug;

    if (!slug) {
      console.log('Client connected but there is no slug, returning');
      return;
    }

    this.logger.log(`Client ${client.id} connected to page - Slug: ${slug}`);

    await client.join(`page-${slug}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() body: { slug: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { slug } = body;
    if (!slug) {
      this.logger.warn(
        'Client connected but there is no slug. Not joining room.',
      );
      return;
    }

    await client.join(`page-${slug}`);
    this.logger.log(`Client ${client.id} joined room - Slug: ${slug}`);

    const activeTipIds = await this.getActiveTipIds(slug);
    if (activeTipIds.length) {
      const tips = await this.tipsRepo.find({
        where: { id: In(activeTipIds) },
        relations: { page: true, payment: true },
      });

      const payloads = await Promise.all(
        tips.map((tip) => this.generateEventPayload(tip, true)),
      );

      return payloads;
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('addTipToObs')
  async handleAddTipToObs(
    @MessageBody() body: { slug: string; tipId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { slug, tipId } = body;
    const user = (client as any).user;

    const page = await this.pagesService.findByPath(slug);
    if (!page) return { error: 'Page not found' };

    if (page.userId !== user.id) return { error: 'Unauthorized' };

    let tip = await this.tipsRepo.findOne({
      where: { id: tipId },
      relations: { page: true, payment: true },
    });

    if (!tip) return { error: 'Tip not found' };

    if (tip.page.id !== page.id) return { error: 'Tip not found' };

    const {
      tip: t,
      message,
      autoRemove,
    } = await this.generateEventPayload(tip);

    this.server
      .to(`page-${slug}`)
      .emit('obsTip', { tip: t, message, autoRemove });

    await this.addTipToObsCache(slug, tip.id);

    this.logger.log(`Send tip ${tipId} on OBS ${slug}`);

    return { message: 'Tip is added on the OBS page.' };
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('removeTipFromObs')
  async handleRemoveTipFromObs(
    @MessageBody() body: { slug: string; tipId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { slug, tipId } = body;
    const user = (client as any).user;

    const page = await this.pagesService.findByPath(slug);
    if (!page) throw new WsException('Page not found');

    if (page.userId !== user.id) throw new WsException('Unauthorized');

    this.server.to(`page-${slug}`).emit('obsTipRemove', { tipId });

    await this.removeTipFromObsCache(slug, tipId);

    return { message: 'Tip is removed from the OBS page.' };
  }

  notifyPagePayment(slug: string, payment: Payment) {
    return this.server.to(`page-${slug}`).emit('payment', payment);
  }

  async notifyNewTip(slug: string, tipId: number) {
    const tip = await this.tipsRepo.findOne({
      where: { id: tipId },
      relations: { page: true, payment: true },
    });

    if (!tip) return;

    const eventPayload = await this.generateEventPayload(tip, true);
    return this.server.to(`page-${slug}`).emit('obsTip', eventPayload);
  }

  async addTipToObsCache(slug: string, tipId: number) {
    const activeTips =
      (await this.cache.get<number[]>(`obs-tips:${slug}`)) || [];
    await this.cache.set(`obs-tips:${slug}`, [...activeTips, tipId], {
      ttl: 60 * 60 * 24,
    } as any);
  }

  async removeTipFromObsCache(slug: string, tipId: number) {
    const activeTips =
      (await this.cache.get<number[]>(`obs-tips:${slug}`)) || [];
    await this.cache.set(
      `obs-tips:${slug}`,
      activeTips.filter((id) => id !== tipId),
      { ttl: 60 * 60 * 24 } as any,
    );
  }

  async getActiveTipIds(slug: string) {
    return (await this.cache.get<number[]>(`obs-tips:${slug}`)) || [];
  }

  hidePrivateTipFields(tip: Tip) {
    if (tip.private) {
      tip.name = '';
      tip.message = '';
    }

    return tip;
  }

  async generateEventPayload(tip: Tip, autoRemove: boolean = false) {
    const message = await this.tipMessageService.generateMessage(
      tip.id,
      tip.page.id,
    );
    // const message = await this.getTipMessage(tip);
    const t = this.hidePrivateTipFields(tip);

    return { tip: t, message, autoRemove };
  }
}
