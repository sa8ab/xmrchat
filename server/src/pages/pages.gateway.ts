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
import { WsGuard } from 'src/shared/decorators/ws-guard.decorator';

@WebSocketGateway({ namespace: '/pages', cors: { origin: true } })
export class PagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(PagesGateway.name);

  constructor(
    @Inject(forwardRef(() => PagesService)) private pagesService: PagesService,
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

  @WsGuard()
  @SubscribeMessage('addTipToObs')
  async handleAddTipToObs(
    @MessageBody() body: { slug: string; tip: Tip },
    @ConnectedSocket() client: Socket,
  ) {
    const { slug, tip } = body;
    const user = (client as any).user;

    const page = await this.pagesService.findByPath(slug);
    if (!page) throw new WsException('Page not found');

    if (page.userId !== user.id)
      throw new WsException('You are not allowed to add tips to this page');

    this.server.to(`page-${slug}`).emit('obsTip', { tip, autoRemove: false });

    return { message: 'Tip is added on the OBS page.' };
  }

  @WsGuard()
  @SubscribeMessage('removeTipFromObs')
  async handleRemoveTipFromObs(
    @MessageBody() body: { slug: string; tip: Tip },
    @ConnectedSocket() client: Socket,
  ) {
    const { slug, tip } = body;
    const user = (client as any).user;

    const page = await this.pagesService.findByPath(slug);
    if (!page) throw new WsException('Page not found');

    if (page.userId !== user.id)
      throw new WsException(
        'You are not allowed to remove tips from this page',
      );

    this.server.to(`page-${slug}`).emit('obsTipRemove', { tip });

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
}
