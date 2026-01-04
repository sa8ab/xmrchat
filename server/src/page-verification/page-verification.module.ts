import { Module } from '@nestjs/common';
import { PageVerificationService } from './page-verification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageVerification } from './page-verification.entity';
import { PagesModule } from 'src/pages/pages.module';
import { TwitterVerificationHandler } from './handlers/twitter-verification.handler';
import { HttpModule } from '@nestjs/axios';
import { PageVerificationController } from './page-verification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PageVerification]),
    PagesModule,
    HttpModule.register({}),
  ],
  providers: [PageVerificationService, TwitterVerificationHandler],
  exports: [PageVerificationService],
  controllers: [PageVerificationController],
})
export class PageVerificationModule {}
