import { Controller, Post } from '@nestjs/common';
import { TwitchService } from './twitch.service';

@Controller('twitch')
export class TwitchController {
  constructor(private twitchService: TwitchService) {}

  @Post('/test-message')
  sendTestMessage() {
    return this.twitchService.sendTestMessage('heyzeusherestoast', 'Test');
  }
}
