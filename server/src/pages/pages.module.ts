import { forwardRef, Module } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './page.entity';
import { LwsModule } from 'src/lws/lws.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { PagesGateway } from './pages.gateway';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { TwitchModule } from 'src/integrations/twitch/twitch.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Page]),
    LwsModule,
    PaymentsModule,
    NotificationsModule,
    TwitchModule,
  ],
  controllers: [PagesController],
  providers: [PagesService, PagesGateway],
  exports: [PagesService, PagesGateway],
})
export class PagesModule {}
