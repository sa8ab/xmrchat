import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { LwsService } from './lws.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { ConfigService } from '@nestjs/config';
import { LwsWebhookEvent } from 'src/shared/types';

@Controller('lws')
export class LwsController {
  constructor(
    private lwsService: LwsService,
    private configService: ConfigService,
  ) {}
  @Get('/get-accounts')
  @IsPublic()
  listAccounts() {
    return this.lwsService.getAccounts();
  }

  @Get('/list-wehhooks')
  @IsPublic()
  listWebhooks() {
    return this.lwsService.listWebhooks();
  }

  // @Post('/webhooks/:token')
  // @IsPublic()
  // handleWebhook(@Param('token') token: string, @Body() body: LwsWebhookEvent) {
  //   if (token !== this.configService.get('LWS_WEBHOOK_TOKEN'))
  //     throw new UnauthorizedException();

  //   return this.lwsService.handleEvent(body);
  // }
}
