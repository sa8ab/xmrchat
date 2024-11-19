import { Module } from '@nestjs/common';
import { TwitchService } from './twitch.service';
import { TwitchController } from './twitch.controller';

@Module({
  providers: [TwitchService],
  controllers: [TwitchController],
  exports: [TwitchService],
})
export class TwitchModule {}
