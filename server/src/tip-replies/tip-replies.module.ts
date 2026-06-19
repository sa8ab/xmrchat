import { Module } from '@nestjs/common';
import { TipRepliesService } from './tip-replies.service';
import { TipRepliesController } from './tip-replies.controller';
import { TipsModule } from 'src/tips/tips.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipReply } from './tip-reply.entity';

@Module({
  imports: [TipsModule, TypeOrmModule.forFeature([TipReply])],
  providers: [TipRepliesService],
  controllers: [TipRepliesController],
})
export class TipRepliesModule {}
