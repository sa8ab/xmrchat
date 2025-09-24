import { Controller, Get } from '@nestjs/common';
import { LiveStreamsService } from './live-streams.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';

@Controller('live-streams')
export class LiveStreamsController {
  constructor(private readonly liveStreamsService: LiveStreamsService) {}

  @Get('/')
  @IsPublic()
  async getLiveStreams() {
    const liveStreams = await this.liveStreamsService.findAll();
    return { liveStreams };
  }

  @Get('/update')
  @IsPublic()
  async updateLiveStreams() {
    const liveStreams = await this.liveStreamsService.getAndUpdateLiveStreams();
    return { liveStreams };
  }
}
