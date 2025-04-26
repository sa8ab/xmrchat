import { Module } from '@nestjs/common';
import { TipsController } from './tips.controller';
import { TipsService } from './tips.service';
import { PagesModule } from 'src/pages/pages.module';
import { LwsModule } from 'src/lws/lws.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tip } from './tip.entity';
import { PaymentsModule } from 'src/payments/payments.module';
import { TipsGateway } from './tips.gateway';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PricesModule } from 'src/prices/prices.module';
import { SwapsModule } from 'src/swaps/swaps.module';

@Module({
  controllers: [TipsController],
  providers: [TipsService, TipsGateway],
  imports: [
    PagesModule,
    PaymentsModule,
    LwsModule,
    NotificationsModule,
    PricesModule,
    SwapsModule,
    TypeOrmModule.forFeature([Tip]),
  ],
  exports: [TipsService, TipsGateway],
})
export class TipsModule {}
