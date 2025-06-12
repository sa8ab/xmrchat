import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from './shared/decorators/is-public.decorator';
import { NotificationsService } from './notifications/notifications.service';
import { TipsService } from './tips/tips.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private notificationsService: NotificationsService,
    private tipsService: TipsService,
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
    return this.tipsService.deleteExpiredWebhooks();
  }
}
