import { Body, Controller, Post } from '@nestjs/common';
import { CreatePageTipTierDto } from './dtos/create-page-tip-tier.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { PageTipTiersService } from './page-tip-tiers.service';

@Controller('page-tip-tiers')
export class PageTipTiersController {
  constructor(private pageTipTiersService: PageTipTiersService) {}

  @Post('/')
  async create(@Body() dto: CreatePageTipTierDto, @CurrentUser() user: User) {
    const res = await this.pageTipTiersService.create(dto, user);
    return { message: 'Page tip tier created successfully.' };
  }
}
