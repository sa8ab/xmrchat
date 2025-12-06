import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Namespace, Socket } from 'socket.io';
import { Payment } from 'src/payments/payment.entity';
import { Swap } from 'src/swaps/swap.entity';

@WebSocketGateway({
  namespace: '/super-dms',
})
export class SuperDmGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(SuperDmGateway.name);

  @WebSocketServer()
  server: Namespace;

  async handleConnection(client: Socket) {}

  handleDisconnect() {}
}
