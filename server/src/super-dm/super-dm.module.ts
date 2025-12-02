import { Module } from '@nestjs/common';
import { SuperDmService } from './super-dm.service';
import { SuperDmController } from './super-dm.controller';
import { PageSettingsModule } from 'src/page-settings/page-settings.module';
import { PagesModule } from 'src/pages/pages.module';
import { SuperDmSettingsService } from './super-dm-settings.service';
import { PaymentFlowModule } from 'src/payment-flow/payment-flow.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperDm } from './super-dm.entity';
import { PaymentsService } from 'src/payments/payments.service';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    PageSettingsModule,
    PagesModule,
    PageSettingsModule,
    PaymentsModule,
    PaymentFlowModule,
    TypeOrmModule.forFeature([SuperDm]),
  ],
  providers: [SuperDmService, SuperDmSettingsService],
  controllers: [SuperDmController],
})
export class SuperDmModule {}
