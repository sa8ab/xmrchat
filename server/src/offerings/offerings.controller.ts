import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OfferingsService } from './offerings.service';
import { PagesService } from 'src/pages/pages.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { OfferingRO, OfferingsRO } from './dtos/offering.dto';
import { CreateOfferingDto } from './dtos/create-offering.dto';

@Controller('offerings')
export class OfferingsController {
  constructor(private offeringsService: OfferingsService) {}

  @Get('/')
  @Serialize(OfferingRO)
  async findAll(@CurrentUser() user: User) {
    const result = await this.offeringsService.findAll(user);

    return { offerings: result };
  }

  @Get('/:id')
  @Serialize(OfferingRO)
  async findOne(@Param('id') id: number, @CurrentUser() user: User) {
    const offering = await this.offeringsService.findOne(id);

    return { offering };
  }

  @Post('/')
  async create(@Body() dto: CreateOfferingDto, @CurrentUser() user: User) {
    await this.offeringsService.create(dto, user);

    return { message: 'Offering created.' };
  }
}
