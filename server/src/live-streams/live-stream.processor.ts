import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { LiveStreamsService } from './live-streams.service';

@Processor('live-stream')
export class LiveStreamProcessor extends WorkerHost {
  private readonly logger = new Logger(LiveStreamProcessor.name);
  constructor(private liveStreamsService: LiveStreamsService) {
    super();
  }

  async process(job: Job) {
    const liveStreams = await this.liveStreamsService.getAndUpdateLiveStreams();
    return liveStreams;
  }
}
