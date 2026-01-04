import { Body, Controller, Post } from '@nestjs/common';
import { PageVerificationService } from './page-verification.service';
import { CreatePageVerificationDto } from './dtos/create-page-verification.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { PageVerificationRo } from './dtos/page-verification.dto';

@Controller('page-verification')
export class PageVerificationController {
  constructor(private pageVerificationService: PageVerificationService) {}

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
