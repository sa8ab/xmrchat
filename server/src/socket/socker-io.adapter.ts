import { IoAdapter } from '@nestjs/platform-socket.io';

export class SocketIoAdaptor extends IoAdapter {
  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, {
      ...options,
      connectionStateRecovery: {},
    });
    return server;
  }
}
