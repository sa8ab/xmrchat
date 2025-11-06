import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePageTipTierDto } from './dtos/create-page-tip-tier.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { PageTipTiersService } from './page-tip-tiers.service';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { PageTipTiersRO } from './dtos/page-tip-tier.dto';

@Controller('page-tip-tiers')
export class PageTipTiersController {
  constructor(private pageTipTiersService: PageTipTiersService) {}

  @Get('/')
  @Serialize(PageTipTiersRO)
  async findAll(@CurrentUser() user: User) {
    const pageTipTiers = await this.pageTipTiersService.findAll(user);
    return { pageTipTiers };
  }

  @Post('/')
  async create(@Body() dto: CreatePageTipTierDto, @CurrentUser() user: User) {
    const res = await this.pageTipTiersService.create(dto, user);
    return { message: 'Page tip tier created successfully.' };
  }
}
