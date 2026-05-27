import { Module } from '@nestjs/common';
import { TipsBroadcastGateway } from './tips-broadcast.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tip } from 'src/tips/tip.entity';
import { TipMessageModule } from 'src/tip-message/tip-message.module';

@Module({
  imports: [TipMessageModule, TypeOrmModule.forFeature([Tip])],
  providers: [TipsBroadcastGateway],
  exports: [TipsBroadcastGateway],
})
export class TipsBroadcastModule {}
