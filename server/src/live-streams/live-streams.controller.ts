import { Controller, Get } from '@nestjs/common';
import { LiveStreamsService } from './live-streams.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';

@Controller('live-streams')
export class LiveStreamsController {
  constructor(private readonly liveStreamsService: LiveStreamsService) {}

  @Get('/')
  @IsPublic()
  async updateLiveStreams() {
    // const result = await this.liveStreamsService.findAll();
    const liveStreams = await this.liveStreamsService.getAndUpdateLiveStreams();
    return { liveStreams };
  }
}
