import {
  BadRequestException,
  Injectable,
  Logger,
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
import WebSocket from 'ws';

@Injectable()
export class SimplexService {
  private readonly logger = new Logger(SimplexService.name);

  private chat: ChatClient;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    // this.init();
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
        console.log('contactConnected', resp.contact);
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

  async connectContact(link: string) {
    try {
      await this.chat.apiConnect(link);
    } catch (error) {
      throw new BadRequestException(
        'Could not connect. Make sure you sent the correct address and you are not already connected.',
      );
    }
  }
}
