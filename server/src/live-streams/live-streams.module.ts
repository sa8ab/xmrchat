import { Module } from '@nestjs/common';
import { LiveStreamsService } from './live-streams.service';
import { LiveStreamsController } from './live-streams.controller';
import { YoutubeModule } from 'src/integrations/youtube/youtube.module';
import { YoutubeProvider } from './providers/youtube.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from 'src/links/link.entity';
import { LiveStream } from './live-stream.entity';

@Module({
  imports: [YoutubeModule, TypeOrmModule.forFeature([LiveStream, Link])],
  controllers: [LiveStreamsController],
  providers: [LiveStreamsService, YoutubeProvider],
})
export class LiveStreamsModule {}
