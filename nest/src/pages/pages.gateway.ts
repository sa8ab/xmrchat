import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { Payment } from 'src/payments/payment.entity';
import { Tip } from 'src/tips/tip.entity';

@WebSocketGateway({ namespace: '/pages', cors: { origin: true } })
export class PagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(PagesGateway.name);

  @WebSocketServer()
  server: Namespace;

  async handleConnection(client: Socket) {
    const slug = client.handshake.auth.slug;

    if (!slug) {
      console.log('Client connected but there is no slug, returning');
      return
    };

    this.logger.log(`Client ${client.id} connected to page - Slug: ${slug}`);

    await client.join(`page-${slug}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
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
