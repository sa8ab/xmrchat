import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from './shared/decorators/is-public.decorator';
import { NotificationsService } from './notifications/notifications.service';
import { SimplexService } from './integrations/simplex/simplex.service';
import { SignalService } from './integrations/signal/signal.service';
import { NotificationDispatcherService } from './notifications/notification-dispatcher.service';
import { NotificationTestsService } from './notifications/notification-tests.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private notificationsService: NotificationsService,
    private simplexService: SimplexService,
    private signalService: SignalService,
    private notificationDispatcherService: NotificationDispatcherService,
    private notificationTestsService: NotificationTestsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @IsPublic()
  // @Get('/send-email')
  // sendEmail() {
  //   return this.notificationsService.sendTestEmail();
  // }

  @IsPublic()
  @Get('/test')
  async test() {
    // return this.signalService.sendTestMessage();
    // return this.notificationDispatcherService.notifyNewTip(1, 271);
  }
}
