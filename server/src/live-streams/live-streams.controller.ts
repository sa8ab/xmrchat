import { Controller, Get } from '@nestjs/common';
import { LiveStreamsService } from './live-streams.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { LiveStreamListDto } from './dtos/live-stream.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesEnum } from '../shared/constants/enum';

@Controller('live-streams')
export class LiveStreamsController {
  constructor(private readonly liveStreamsService: LiveStreamsService) {}

  @Get('/')
  @Serialize(LiveStreamListDto)
  @IsPublic()
  async getLiveStreams() {
    const liveStreams = await this.liveStreamsService.findAll();
    return { liveStreams };
  }
}
