import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { TipRepliesService } from './tip-replies.service';
import { TipReplyDtoRO } from './dtos/tip-reply.dto';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { CreateTipReplyDto } from './dtos/create-tip-reply.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { UpdateTipReplyDto } from './dtos/update-tip-reply.dto';
import { TipReplySettingsService } from './tip-reply-settings.service';
import { UpdateTipReplySettingsDto } from './dtos/update-tip-reply-settings.dto';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';

@Controller('tip-replies')
export class TipRepliesController {
  constructor(
    private tipRepliesService: TipRepliesService,
    private tipReplySettingsService: TipReplySettingsService,
  ) {}

  @Get('/settings')
  async getSettings(@CurrentUser() user: User) {
    const settings = await this.tipReplySettingsService.getSettings(user);
    return { settings };
  }

  @Put('/settings')
  async updateSettings(
    @Body() dto: UpdateTipReplySettingsDto,
    @CurrentUser() user: User,
  ) {
    await this.tipReplySettingsService.updateSettings(dto, user);
    return { message: 'Tip reply settings updated.' };
  }

  @Get('/:pageSlug/settings')
  @IsPublic()
  async getSettingsByPageSlug(@Param('pageSlug') pageSlug: string) {
    const settings =
      await this.tipReplySettingsService.getSettingsByPageSlug(pageSlug);
    return { settings };
  }

  @Get('/:id')
  @Serialize(TipReplyDtoRO)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const tipReply = await this.tipRepliesService.findOneById(id);
    return { tipReply };
  }

  @Post('/:tipId')
  async create(
    @Body() dto: CreateTipReplyDto,
    @CurrentUser() user: User,
    @Param('tipId', ParseIntPipe) tipId: number,
  ) {
    await this.tipRepliesService.create(dto, user, tipId);
    return { message: 'Tip reply created.' };
  }

  @Put('/:id')
  async update(
    @Body() dto: UpdateTipReplyDto,
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.tipRepliesService.update(id, dto, user);
    return { message: 'Tip reply updated.' };
  }

  @Delete('/:id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    await this.tipRepliesService.delete(id, user);
    return { message: 'Tip reply deleted.' };
  }
}
