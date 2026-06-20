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

@Controller('tip-replies')
export class TipRepliesController {
  constructor(private tipRepliesService: TipRepliesService) {}

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
