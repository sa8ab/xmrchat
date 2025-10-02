import { Controller, Post } from '@nestjs/common';
import { LiveStreamsService } from 'src/live-streams/live-streams.service';
import { RolesEnum } from 'src/shared/constants';
import { Roles } from 'src/shared/decorators/roles.decorator';

@Controller('admin')
@Roles(RolesEnum.ADMIN)
export class AdminController {
  constructor(private readonly liveStreamsService: LiveStreamsService) {}

  @Post('/update-live-streams')
  async updateLiveStreams() {
    const liveStreams = await this.liveStreamsService.getAndUpdateLiveStreams();
    return { liveStreams };
  }
}
