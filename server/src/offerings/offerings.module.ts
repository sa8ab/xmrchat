import { Module } from '@nestjs/common';
import { OfferingsService } from './offerings.service';

@Module({
  providers: [OfferingsService]
})
export class OfferingsModule {}
