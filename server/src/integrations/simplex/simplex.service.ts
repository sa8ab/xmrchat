import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ChatClient } from 'simplex-chat';
import { ChatType, CreateActiveUser } from 'simplex-chat/dist/command';
import { ciContentText, ChatInfoType } from 'simplex-chat/dist/response';
import { ConfigService } from '@nestjs/config';
import WebSocket from 'ws';

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
      this.chat = await ChatClient.create('ws://localhost:5225');
      const user = await this.chat.apiGetActiveUser();
      console.log(user);
    } catch (error) {
      this.logger.error('Error creating chat client', error);
    }
    // const ws = new WebSocket('ws://localhost:5225');
    // ws.on('open', () => {
    //   console.log('connected to simplex');
    // });
    // ws.on('message', (message) => {
    //   console.log('message', message);
    // });
    // ws.on('error', (error) => {
    //   console.log('error', error);
    // });
    // ws.on('close', () => {
    //   console.log('closed');
    // });
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
