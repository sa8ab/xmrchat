import { Module } from '@nestjs/common';
import { PageVerificationService } from './page-verification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageVerification } from './page-verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PageVerification])],
  providers: [PageVerificationService],
  exports: [PageVerificationService],
})
export class PageVerificationModule {}
