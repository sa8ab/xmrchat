import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { Payment } from 'src/payments/payment.entity';
import { Swap } from 'src/swaps/swap.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { SuperDmsService } from './super-dms.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuperDm } from './super-dm.entity';
import * as openpgp from 'openpgp';

/**
 * @description Gateway for super DMs.
 * @emits super-dm-payment - When a payment is made for a super DM.
 * @emits swap-status-change - When a swap status changes.
 **/
@WebSocketGateway({
  namespace: '/super-dms',
})
export class SuperDmsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(SuperDmsGateway.name);

  constructor(@InjectRepository(SuperDm) private repo: Repository<SuperDm>) {}

  @WebSocketServer()
  server: Namespace;

  async handleConnection(client: Socket) {
    const superDmId = client.handshake.query.superDmId;

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

  @SubscribeMessage('send-message')
  async sendMessage(
    @MessageBody()
    body: SendMessageDto,
  ) {
    if (!body.superDmId) return { error: 'Super DM id is required' };

    const superDm = await this.repo.findOne({ where: { id: body.superDmId } });

    if (!superDm) return { error: 'Super DM is not found' };

    const superDmPublicKey = await openpgp.readKey({
      armoredKey: superDm.publicKey,
    });

    const messageToVerify = `${body.content}|${body.date}`;
    const verified = await openpgp.verify({
      message: await openpgp.createMessage({ text: messageToVerify }),
      verificationKeys: [superDmPublicKey],
    });
    try {
      await verified.signatures[0].verified;
    } catch (error) {
      return { error: 'Message is not verified' };
    }

    // TODO validate timestamp

    // TODO: save message
  }
}
