import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ChatClient } from '@reply2future/simplex-chat';
import {
  ChatType,
  CreateActiveUser,
  ChatCommand,
} from '@reply2future/simplex-chat/dist/command';
import {
  ciContentText,
  ChatInfoType,
  ChatResponse,
} from '@reply2future/simplex-chat/dist/response';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IntegrationConfig } from '../integration-configs.entity';
import { Raw, Repository } from 'typeorm';

@Injectable()
export class SimplexService {
  private readonly logger = new Logger(SimplexService.name);

  private chat: ChatClient;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(IntegrationConfig)
    private icRepo: Repository<IntegrationConfig>,
  ) {}

  async onModuleInit() {
    this.init();
  }

  async init() {
    const wsUrl = this.configService.get('SIMPLEX_WS_URL');
    if (!wsUrl) {
      this.logger.warn('SIMPLEX_WS_URL is not set.');
      return;
    }
    try {
      this.chat = await ChatClient.create(wsUrl);

      const user = await this.chat.apiGetActiveUser();
      if (!user) {
        this.logger.warn(
          'No user found on Simplex. Please create one from CLI.',
        );
        return;
      }

      await this.generateAddress();

      this.logger.log(
        `Bot profile: ${user.profile.displayName} (${user.profile.fullName})`,
      );

      this.initMsgQ();

      this.chat.enableAddressAutoAccept();
    } catch (error) {
      console.log('Init error:', error.response);
    }
  }

  async initMsgQ() {
    for await (const r of this.chat.msgQ) {
      const resp = r instanceof Promise ? await r : r;
      if (resp.type === 'contactConnected') {
        try {
          await this.handleContactContactConnected(resp.contact);
          await this.chat.apiSendTextMessage(
            ChatType.Direct,
            resp.contact.contactId,
            'Connected to XMRChat. You can now enable your simplex notifications from notifications page.',
          );
        } catch (error) {
          this.logger.error('Error handling contact connected', error);
        }
      }

      if (resp.type === 'newChatItems') {
        for (const { chatInfo, chatItem } of resp.chatItems) {
          if (chatInfo.type !== ChatInfoType.Direct) continue;
          const msg = ciContentText(chatItem.content);
          if (msg) {
            console.log(msg);
          }
        }
      }
    }
  }

  async generateAddress() {
    try {
      this.logger.log('Getting address...');
      const res = await this.chat.sendChatCmdStr('/show_address');
      // @ts-ignore
      const address = res?.contactLink?.connLinkContact?.connFullLink;
      if (address) {
        return address;
      }
    } catch (error) {
      this.logger.error('Generating address failed');
    }
    this.logger.log('No address found, creating new one...');
    const res = await this.chat.sendChatCmdStr('/address');

    // @ts-ignore
    const address = res?.connLinkContact?.connFullLink;
    if (address) {
      return address;
    }
  }

  async handleContactContactConnected(contact: any) {
    this.logger.log(`${contact.profile.displayName} connected`);
    const connId = contact.activeConn?.agentConnId;
    const config = await this.icRepo.findOne({
      where: {
        config: Raw((alias) => `${alias} ->> 'connId' = :connId`, {
          connId,
        }),
      },
    });

    if (!config) {
      throw new NotFoundException(`No config found for connId: ${connId}`);
    }

    config.config.contactId = contact.contactId;
    config.config.contact = contact;

    await this.icRepo.save(config);
  }

  async connectContact(link: string) {
    const res = await this.chat.sendChatCmdStr(`/connect ${link}`);
    console.log(res);
    const connId =
      (res as any).connection?.pccAgentConnId ||
      (res as any).connectionPlan?.contactAddressPlan?.contact?.activeConn
        ?.agentConnId;

    if (!connId) {
      throw new BadRequestException(
        'Connection id was not found, please try again.',
      );
    }
    return connId;
  }

  async sendMessage(contactId: number, message: string) {
    await this.chat.apiSendTextMessage(ChatType.Direct, contactId, message);
  }
}
