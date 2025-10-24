import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'notifications-email' },
      { name: 'notifications-simplex' },
      { name: 'notifications-signal' },
      { name: 'live-stream' },
      { name: 'notifications-daily-summary' },
    ),

    BullBoardModule.forFeature({
      name: 'notifications-email',
      adapter: BullMQAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'notifications-simplex',
      adapter: BullMQAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'notifications-signal',
      adapter: BullMQAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'live-stream',
      adapter: BullMQAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'notifications-daily-summary',
      adapter: BullMQAdapter,
    }),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
