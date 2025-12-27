import { Logger, UseGuards } from '@nestjs/common';
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
import { Payment } from 'src/payments/payment.entity';
import { Swap } from 'src/swaps/swap.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { SuperDmsService } from './super-dms.service';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { SuperDm } from './super-dm.entity';
import * as openpgp from 'openpgp';
import { SuperDmMessage } from './super-dm-message.entity';
import {
  Action,
  PageSettingKey,
  SuperDmMessageSenderType,
} from 'src/shared/constants';
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { PageSettingsService } from 'src/page-settings/page-settings.service';
import { getErrorMessage } from 'src/shared/utils/errors';
import { verifySignature } from 'src/shared/utils/encryption';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { SuperDmMessagesService } from './super-dm-messages.service';
import { ReadMessagesDto } from './dto/read-messages.dto';
import { serializer } from 'src/shared/interceptors/serialize.interceptor';
import { SuperDmMessageDto } from './dto/super-dm-message.dto';

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
    private notificationsService: NotificationsService,
    private superDmMessagesService: SuperDmMessagesService,
    private casl: CaslAbilityFactory,
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

    if (!body.superDmId) return { error: 'SuperDM id is required' };

    const superDm = await this.repo.findOne({
      where: { id: body.superDmId, payment: { paidAt: Not(IsNull()) } },
    });

    if (!superDm) return { error: 'SuperDM is not found' };

    if (superDm.endedAt) return { error: 'SuperDM is ended.' };

    try {
      await this.verifyMessage({
        message: body.content,
        signature: body.signature,
        publicKeyArmored: superDm.publicKey,
        date: body.date,
      });
    } catch (error) {
      return { error: getErrorMessage(error, 'Message is not verified') };
    }

    const created = this.messagesRepo.create({
      content: body.content,
      superDm: { id: superDm.id },
      senderType: SuperDmMessageSenderType.VIEWER,
    });
    await this.messagesRepo.save(created);

    this.handleMessageCreated(created);

    await this.notificationsService.handleSuperDmMessage(
      superDm.pageId,
      superDm.id,
      created.id,
    );

    return { message: 'message send', superDmMessage: created };
  }

  @SubscribeMessage('streamer-send-message')
  @UseGuards(WsAuthGuard)
  async streamerSendMessage(
    @MessageBody() body: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!body.superDmId) return { error: 'SuperDM id is required' };

    const superDm = await this.repo.findOne({
      where: { id: body.superDmId, payment: { paidAt: Not(IsNull()) } },
      relations: { page: true },
    });
    if (!superDm) return { error: 'SuperDM is not found' };

    if (superDm.endedAt) return { error: 'SuperDM is ended.' };

    const user = (client as any).user;
    const ability = await this.casl.createForUser(user);

    if (!ability.can(Action.SendSuperDmMessage, superDm))
      return { error: 'Unauthorized' };

    const pagePublicKeyArmored = await this.pageSettingsService.getSettingValue(
      superDm.page.path,
      PageSettingKey.SUPER_DM_PUBLIC_KEY,
    );
    if (!pagePublicKeyArmored)
      return { error: 'Page public key is not configured' };

    try {
      await this.verifyMessage({
        message: body.content,
        signature: body.signature,
        publicKeyArmored: pagePublicKeyArmored,
        date: body.date,
      });
    } catch (error) {
      return { error: getErrorMessage(error, 'Message is not verified') };
    }

    const created = this.messagesRepo.create({
      content: body.content,
      superDm: { id: superDm.id },
      senderType: SuperDmMessageSenderType.CREATOR,
    });
    await this.messagesRepo.save(created);

    this.handleMessageCreated(created);

    return { message: 'message send', superDmMessage: created };
  }

  @SubscribeMessage('read-messages')
  async readMessages(@MessageBody() body: ReadMessagesDto) {
    if (!body.superDmId) return { error: 'SuperDM id is required' };
    if (!body.senderType) return { error: 'Sender type is required' };
    if (!body.signature) return { error: 'Signature is required' };
    if (!body.date) return { error: 'Date is required' };

    const superDm = await this.repo.findOne({
      where: { id: body.superDmId },
      relations: { page: true },
    });
    if (!superDm) return { error: 'SuperDM is not found' };

    let publicKeyArmored: string;
    if (body.senderType === SuperDmMessageSenderType.VIEWER) {
      publicKeyArmored = superDm.publicKey;
    } else {
      publicKeyArmored = await this.pageSettingsService.getSettingValue(
        superDm.page.path,
        PageSettingKey.SUPER_DM_PUBLIC_KEY,
      );
    }

    if (!publicKeyArmored) return { error: 'Public key is not found' };

    try {
      await verifySignature({
        message: JSON.stringify({ date: body.date }),
        signature: body.signature,
        publicKeyArmored,
        date: body.date,
      });
    } catch (error) {
      return { error: getErrorMessage(error, 'Message is not verified') };
    }

    if (new Date(body.date) < new Date(Date.now() - 60 * 1000)) {
      return { error: 'Message is too old' };
    }

    let messages: SuperDmMessage[] = [];
    try {
      messages = await this.superDmMessagesService.readMessages(
        superDm.id,
        body.senderType === SuperDmMessageSenderType.VIEWER
          ? SuperDmMessageSenderType.CREATOR
          : SuperDmMessageSenderType.VIEWER,
      );
    } catch (error) {
      return { error: getErrorMessage(error, 'Failed to read messages') };
    }

    const messagesDto = messages.map((message) =>
      serializer(SuperDmMessageDto, message),
    );

    if (messagesDto.length) {
      this.server
        .to(`super-dm-${superDm.id}`)
        .emit('read-messages-updated', { messages: messagesDto });
    }
  }

  async verifyMessage(params: {
    message: string;
    signature: string;
    publicKeyArmored: string;
    date: string;
  }) {
    const messageToVerify = JSON.stringify({
      armoredMessage: params.message,
      date: params.date,
    });

    await verifySignature({
      message: messageToVerify,
      signature: params.signature,
      publicKeyArmored: params.publicKeyArmored,
      date: params.date,
    });

    // time is not older than 1 minute
    if (new Date(params.date) < new Date(Date.now() - 60 * 1000)) {
      throw new WsException('Message is too old');
    }
  }

  async handleMessageCreated(superDmMessage: SuperDmMessage) {
    this.server
      .to(`super-dm-${superDmMessage.superDm.id}`)
      .emit('super-dm-message', { superDmMessage });
  }
}
