import { Body, Controller, Get, Post } from '@nestjs/common';
import { PageVerificationService } from './page-verification.service';
import { CreatePageVerificationDto } from './dtos/create-page-verification.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import {
  PageVerificationRo,
  PageVerificationsRo,
} from './dtos/page-verification.dto';

@Controller('page-verification')
export class PageVerificationController {
  constructor(private pageVerificationService: PageVerificationService) {}

  @Get()
  @Serialize(PageVerificationsRo)
  async findByUser(@CurrentUser() user: User) {
    const verifications = await this.pageVerificationService.findByUser(user);
    return { pageVerifications: verifications };
  }

  @Post()
  @Serialize(PageVerificationRo)
  async create(
    @Body() body: CreatePageVerificationDto,
    @CurrentUser() user: User,
  ) {
    const verification = await this.pageVerificationService.create(user, body);
    return { pageVerification: verification };
  }
}
