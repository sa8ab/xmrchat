import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from './shared/decorators/is-public.decorator';
import { NotificationsService } from './notifications/notifications.service';
import { SimplexService } from './integrations/simplex/simplex.service';
import { SignalService } from './integrations/signal/signal.service';
import { NotificationDispatcherService } from './notifications/notification-dispatcher.service';
import { NotificationTestsService } from './notifications/notification-tests.service';
import { TwitchService } from './integrations/twitch/twitch.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private notificationsService: NotificationsService,
    private simplexService: SimplexService,
    private signalService: SignalService,
    private notificationDispatcherService: NotificationDispatcherService,
    private notificationTestsService: NotificationTestsService,
    private twitchService: TwitchService,
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
    // return this.notificationTestsService.testSignal();
    // return this.signalService.sendTestMessage();
    // return this.notificationDispatcherService.notifyNewTip(1, 271);
    // return this.twitchService.getLiveStreams([]);
  }
}
