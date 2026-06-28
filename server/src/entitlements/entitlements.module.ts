import { Module } from '@nestjs/common';
import { EntitlementsService } from './entitlements.service';

@Module({
  providers: [EntitlementsService]
})
export class EntitlementsModule {}
