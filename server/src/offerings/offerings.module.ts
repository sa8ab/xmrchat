import { Module } from '@nestjs/common';
import { OfferingsService } from './offerings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offering } from './offering.entity';
import { PagesModule } from 'src/pages/pages.module';
import { OfferingsController } from './offerings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Offering]), PagesModule],
  providers: [OfferingsService],
  controllers: [OfferingsController],
})
export class OfferingsModule {}
