import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ChatClient } from 'simplex-chat';
import { ChatType, CreateActiveUser } from 'simplex-chat/dist/command';
import { ciContentText, ChatInfoType } from 'simplex-chat/dist/response';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class SimplexService {
  private readonly logger = new Logger(SimplexService.name);

  private chat: ChatClient;
  private user: any;

  constructor(private readonly configService: ConfigService) {}

  // async onModuleInit() {
  //   const wsUrl = this.configService.get('SIMPLEX_WS_URL');
  //   if (!wsUrl) {
  //     this.logger.warn('SIMPLEX_WS_URL is not set.');
  //     return;
  //   }
  //   try {
  //     this.chat = await ChatClient.create(wsUrl);
  //   } catch (error) {
  //     this.logger.error('Error creating chat client', error);
  //   }
  // }

  async init() {
    // const wsUrl = this.configService.get('SIMPLEX_WS_URL');
    // if (!wsUrl) {
    //   this.logger.warn('SIMPLEX_WS_URL is not set.');
    //   return;
    // }
    try {
      this.chat = await ChatClient.create('ws://193.36.132.91:5225');
    } catch (error) {
      this.logger.error('Error creating chat client', error);
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
