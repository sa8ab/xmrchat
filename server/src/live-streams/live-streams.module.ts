import { Module } from '@nestjs/common';
import { LiveStreamsService } from './live-streams.service';
import { LiveStreamsController } from './live-streams.controller';
import { YoutubeModule } from 'src/integrations/youtube/youtube.module';
import { YoutubeProvider } from './providers/youtube.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from 'src/links/link.entity';
import { LiveStream } from './live-stream.entity';
import { LinksModule } from 'src/links/links.module';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { LiveStreamProcessor } from './live-stream.processor';
import { TwitchProvider } from './providers/twitch.provider';
import { Page } from 'src/pages/page.entity';
import { TwitchModule } from 'src/integrations/twitch/twitch.module';
import { RumbleModule } from 'src/integrations/rumble/rumble.module';
import { RumbleProvider } from './providers/rumble.provider';

@Module({
  imports: [
    YoutubeModule,
    TwitchModule,
    RumbleModule,
    LinksModule,
    TypeOrmModule.forFeature([LiveStream, Link, Page]),
    BullModule.registerQueue({
      name: 'live-stream',
    }),
    BullBoardModule.forFeature({
      name: 'live-stream',
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [LiveStreamsController],
  providers: [
    LiveStreamsService,
    YoutubeProvider,
    TwitchProvider,
    RumbleProvider,
    LiveStreamProcessor,
  ],
  exports: [LiveStreamsService],
})
export class LiveStreamsModule {}
