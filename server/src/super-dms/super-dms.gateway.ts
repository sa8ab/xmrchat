import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { Payment } from 'src/payments/payment.entity';
import { Swap } from 'src/swaps/swap.entity';

@WebSocketGateway({
  namespace: '/super-dms',
})
export class SuperDmsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(SuperDmsGateway.name);

  @WebSocketServer()
  server: Namespace;

  async handleConnection(client: Socket) {
    const superDmId = client.handshake.query.superDmId;
    if (client.recovered) {
      this.logger.log(`Client ${client.id} recovered`);
    }

    // This is used to trigger the connection recovery
    client.emit('dummyEvent');

    await client.join(`super-dm-${superDmId}`);
  }

  handleDisconnect() {}

  notifyPayment(superDmId: string, payment: Payment) {
    return this.server
      .to(`super-dm-${superDmId}`)
      .emit('super-dm-payment', payment);
  }

  notifySwapStatusChange(superDmId: string, swap: Swap) {
    return this.server
      .to(`super-dm-${superDmId}`)
      .emit('swap-status-change', swap);
  }
}
