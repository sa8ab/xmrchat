import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PaidContentService } from './paid-content.service';
import { PaidContentRO } from './dtos/paid-content.dto';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { CreatePaidContentDto } from './dtos/create-paid-content.dto';
import { UpdatePaidContentDto } from './dtos/update-paid-content.dto';

@Controller('paid-content')
export class PaidContentController {
  constructor(private paidContentService: PaidContentService) {}

  @Get('/')
  @Serialize(PaidContentRO)
  async findAll(@CurrentUser() user: User) {
    const result = await this.paidContentService.findAll(user);

    return { paidContent: result };
  }

  @Get('/:id')
  @Serialize(PaidContentRO)
  async findOne(@Param('id') id: number, @CurrentUser() user: User) {
    const result = await this.paidContentService.findOne(id, user);

    return { paidContent: result };
  }

  @Post('/')
  async create(@Body() dto: CreatePaidContentDto, @CurrentUser() user: User) {
    await this.paidContentService.create(dto, user);

    return { message: 'Paid content created.' };
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePaidContentDto,
    @CurrentUser() user: User,
  ) {
    await this.paidContentService.update(id, dto, user);

    return { message: 'Paid content updated.' };
  }
}
