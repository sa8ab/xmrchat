import { Module } from '@nestjs/common';
import { TwitchService } from './twitch.service';
import { HttpModule } from '@nestjs/axios';
import { TwitchTokenService } from './twitch-token.service';

@Module({
  imports: [HttpModule.register({})],
  providers: [TwitchService, TwitchTokenService],
  exports: [TwitchService, TwitchTokenService],
})
export class TwitchModule {}
