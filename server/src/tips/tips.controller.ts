import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { CreateTipDto } from './dtos/create-tip.dto';
import { TipsService } from './tips.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { TipDto } from './dtos/tip.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { UpdateTipDto } from './dtos/update-tip.dto';

@Controller('tips')
export class TipsController {
  constructor(private tipsService: TipsService) {}

  @Post('')
  @IsPublic()
  createTip(@Body() body: CreateTipDto) {
    return this.tipsService.createTip(body);
  }

  @Get('/page/:slug')
  @IsPublic()
  @Serialize(TipDto)
  getPageTips(@Param('slug') slug: string, @CurrentUser() user: User) {
    return this.tipsService.getTipsByPageSlug(slug, user);
  }

  @Put('/:id')
  updateTip(
    @CurrentUser() user: User,
    @Body() body: UpdateTipDto,
    @Param('id') id: number,
  ) {
    return this.tipsService.updateTipByStreamer(id, body, user);
  }
}
