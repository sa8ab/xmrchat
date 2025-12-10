import { Logger, UseGuards } from '@nestjs/common';
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
import { SuperDmMessage } from './super-sm-message.entity';
import { PageSettingKey, SuperDmMessageSenderType } from 'src/shared/constants';
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { PageSettingsService } from 'src/page-settings/page-settings.service';

/**
 * @description Gateway for super DMs.
 * @emits super-dm-payment - When a payment is made for a super DM.
 * @emits swap-status-change - When a swap status changes.
 * @emits super-dm-message - When a message is sent to a super DM.
 **/
@WebSocketGateway({
  namespace: '/super-dms',
})
export class SuperDmsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(SuperDmsGateway.name);

  constructor(
    @InjectRepository(SuperDm) private repo: Repository<SuperDm>,
    @InjectRepository(SuperDmMessage)
    private messagesRepo: Repository<SuperDmMessage>,
    private pageSettingsService: PageSettingsService,
  ) {}

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
    // TODO: Validate body

    if (!body.superDmId) return { error: 'Super DM id is required' };

    const superDm = await this.repo.findOne({ where: { id: body.superDmId } });

    if (!superDm) return { error: 'Super DM is not found' };

    const superDmPublicKey = await openpgp.readKey({
      armoredKey: superDm.publicKey,
    });

    const messageToVerify = JSON.stringify({
      armoredMessage: body.content,
      date: body.date,
    });
    const signature = await openpgp.readSignature({
      armoredSignature: body.signature,
    });

    const verifyResult = await openpgp.verify({
      message: await openpgp.createMessage({ text: messageToVerify }),
      signature,
      verificationKeys: [superDmPublicKey],
    });
    try {
      await verifyResult.signatures[0].verified;
    } catch (error) {
      return { error: 'Message is not verified' };
    }

    // time is not older than 1 minute
    if (new Date(body.date) < new Date(Date.now() - 60 * 1000)) {
      return { error: 'Message is too old' };
    }

    const created = this.messagesRepo.create({
      content: body.content,
      superDm: { id: superDm.id },
      senderType: SuperDmMessageSenderType.VIEWER,
    });
    await this.messagesRepo.save(created);

    this.server
      .to(`super-dm-${superDm.id}`)
      .emit('super-dm-message', { superDmMessage: created });

    return { message: 'message send', superDmMessage: created };
  }

  @SubscribeMessage('streamer-send-message')
  @UseGuards(WsAuthGuard)
  async streamerSendMessage(@MessageBody() body: SendMessageDto) {
    if (!body.superDmId) return { error: 'Super DM id is required' };

    const superDm = await this.repo.findOne({
      where: { id: body.superDmId },
      relations: { page: true },
    });
    if (!superDm) return { error: 'Super DM is not found' };

    const pagePublicKeyArmored = await this.pageSettingsService.getSettingValue(
      superDm.page.path,
      PageSettingKey.SUPER_DM_PUBLIC_KEY,
    );
    if (!pagePublicKeyArmored)
      return { error: 'Page public key is not configured' };

    const pagePublicKey = await openpgp.readKey({
      armoredKey: pagePublicKeyArmored,
    });

    const messageToVerify = JSON.stringify({
      armoredMessage: body.content,
      date: body.date,
    });
    const signature = await openpgp.readSignature({
      armoredSignature: body.signature,
    });

    const verifyResult = await openpgp.verify({
      message: await openpgp.createMessage({ text: messageToVerify }),
      signature,
      verificationKeys: [pagePublicKey],
    });

    try {
      await verifyResult.signatures[0].verified;
    } catch (error) {
      return { error: 'Message is not verified' };
    }

    // time is not older than 1 minute
    if (new Date(body.date) < new Date(Date.now() - 60 * 1000)) {
      return { error: 'Message is too old' };
    }

    const created = this.messagesRepo.create({
      content: body.content,
      superDm: { id: superDm.id },
      senderType: SuperDmMessageSenderType.CREATOR,
    });
    await this.messagesRepo.save(created);

    this.server
      .to(`super-dm-${superDm.id}`)
      .emit('super-dm-message', { superDmMessage: created });

    return { message: 'message send', superDmMessage: created };
  }
}
