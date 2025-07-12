import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ChatClient } from '@reply2future/simplex-chat';
import {
  ChatType,
  CreateActiveUser,
} from '@reply2future/simplex-chat/dist/command';
import {
  ciContentText,
  ChatInfoType,
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
      this.chat.enableAddressAutoAccept();

      const resp = await this.chat.apiCreateActiveUser({
        displayName: 'XMRChat',
        fullName: '',
      });

      console.log(resp);

      // const user = await this.chat.apiGetActiveUser();
      // console.log('user profile: ', user.profile);

      // for await (const r of this.chat.msgQ) {
      //   const resp = r instanceof Promise ? await r : r;
      //   if (resp.type === 'contactConnected') {
      //     console.log('contactConnected', resp.contact);
      //   }

      //   if (resp.type === 'newChatItems') {
      //     for (const { chatInfo, chatItem } of resp.chatItems) {
      //       if (chatInfo.type !== ChatInfoType.Direct) continue;
      //       const msg = ciContentText(chatItem.content);
      //       if (msg) {
      //         console.log(msg);
      //       }
      //     }
      //   }
      // }
    } catch (error) {
      console.log(error.response);
    }
  }

  async getActiveUser() {
    const user = await this.chat.apiGetActiveUser();
    if (!user) {
      console.log('no user profile');
      return;
    }
    console.log(
      `Bot profile: ${user.profile.displayName} (${user.profile.fullName})`,
    );
  }
}
