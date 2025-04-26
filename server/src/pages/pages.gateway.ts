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
import { Repository } from 'typeorm';
import { clearMessage } from 'src/shared/utils';
import { PricesService } from 'src/prices/prices.service';
import { MoneroUtils } from 'monero-ts';

@WebSocketGateway({ namespace: '/pages', cors: { origin: true } })
export class PagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(PagesGateway.name);

  constructor(
    @Inject(forwardRef(() => PagesService)) private pagesService: PagesService,
    @InjectRepository(Tip) private tipsRepo: Repository<Tip>,
    private pricesService: PricesService,
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

    const tip = await this.tipsRepo.findOne({
      where: { id: tipId },
      relations: { page: true, payment: true },
    });

    if (!tip) return { error: 'Tip not found' };

    if (tip.page.id !== page.id) return { error: 'Tip not found' };

    const message = await this.getTipMessage(tip);

    tip.name = tip.private ? '' : tip.name;
    tip.message = tip.private ? '' : tip.message;

    this.server
      .to(`page-${slug}`)
      .emit('obsTip', { tip, message, autoRemove: false });

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

    return { message: 'Tip is removed from the OBS page.' };
  }

  notifyPagePayment(slug: string, payment: Payment) {
    return this.server.to(`page-${slug}`).emit('payment', payment);
  }

  notifyNewTip(
    slug: string,
    payload: { name: string; amount: string; message: string },
  ) {
    // name, amount, message
    return this.server.to(`page-${slug}`).emit('newTip', payload);
  }

  async getTipMessage(tip: Tip) {
    const clearedMessage = clearMessage(tip.message);

    const xmrUsdPrice = await this.pricesService.getMoneroUsdPrice();

    const xmrValue = MoneroUtils.atomicUnitsToXmr(tip.payment.amount);

    const usdValue = (xmrValue * xmrUsdPrice).toFixed(2);

    return this.getTipMessageText({
      isPrivate: tip.private,
      message: clearedMessage,
      usdAmount: usdValue,
      username: tip.name,
    });
  }

  getTipMessageText(params: {
    usdAmount: string;
    message: string;
    isPrivate: boolean;
    username: string;
  }) {
    return params.isPrivate
      ? `Private Tip: $${params.usdAmount}`
      : `${params.username} tipped $${params.usdAmount} ${params.message ? ': ' : ''} ${params.message || ''}`;
  }
}
