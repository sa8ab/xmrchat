import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/super-dms',
})
export class SuperDmsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(SuperDmsGateway.name);

  @WebSocketServer()
  server: Namespace;

  async handleConnection(client: Socket) {}

  handleDisconnect() {}
}
