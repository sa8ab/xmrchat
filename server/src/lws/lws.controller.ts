import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Body,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { LwsService } from './lws.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('lws')
export class LwsController {
  private isDev: boolean;
  constructor(
    private lwsService: LwsService,
    private configService: ConfigService,
  ) {
    this.isDev = configService.get('NODE_ENV') == 'development';
  }
  @Get('/get-accounts')
  @IsPublic()
  listAccounts() {
    if (!this.isDev)
      throw new UnauthorizedException(
        'This request is only available on development mode.',
      );
    return this.lwsService.getAccounts();
  }

  @Get('/list-wehhooks')
  @IsPublic()
  listWebhooks() {
    if (!this.isDev)
      throw new UnauthorizedException(
        'This request is only available on development mode.',
      );
    return this.lwsService.listWebhooks();
  }

  @Delete('/webhooks/:address')
  @IsPublic()
  deleteWebhooks(@Param('address') address) {
    if (!this.isDev)
      throw new UnauthorizedException(
        'This request is only available on development mode.',
      );

    if (!address) return {};

    return this.lwsService.deleteAddressWebhooks(address);
  }

  @Get('/requests')
  @IsPublic()
  getRequests() {
    if (!this.isDev)
      throw new UnauthorizedException(
        'This request is only available on development mode.',
      );

    return this.lwsService.listRequests();
  }
}
