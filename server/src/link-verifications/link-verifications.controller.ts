import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { LinkVerificationsService } from './link-verifications.service';
import { CreateLinkVerificationDto } from './dtos/create-link-verification.dto';
import { LinkPlatformEnum } from 'src/shared/constants';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { LinkVerificationRo } from './dtos/link-verification.dto';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';

@Controller('link-verifications')
export class LinkVerificationsController {
  constructor(private linkVerificationsService: LinkVerificationsService) {}

  @Post('/:type')
  @Serialize(LinkVerificationRo)
  async create(
    @Param('type') type: LinkPlatformEnum,
    @Body() body: CreateLinkVerificationDto,
    @CurrentUser() user: User,
  ) {
    const verification = await this.linkVerificationsService.create(
      user,
      type,
      body,
    );
    return { linkVerification: verification };
  }

  @Delete('/:type')
  async delete(
    @Param('type') type: LinkPlatformEnum,
    @CurrentUser() user: User,
  ) {
    await this.linkVerificationsService.delete(user, type);
    return { message: 'Link verification deleted.' };
  }
}
