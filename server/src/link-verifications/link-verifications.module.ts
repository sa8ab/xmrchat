import { Module } from '@nestjs/common';
import { LinkVerificationsService } from './link-verifications.service';
import { LinkVerificationsController } from './link-verifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkVerification } from './link-verification.entity';
import { Link } from 'src/links/link.entity';
import { TwitterVerificationHandler } from './handlers/twitter-verification.handler';
import { HttpModule } from '@nestjs/axios';
import { PagesModule } from 'src/pages/pages.module';

@Module({
  imports: [
    PagesModule,
    TypeOrmModule.forFeature([LinkVerification, Link]),
    HttpModule.register({}),
  ],
  providers: [LinkVerificationsService, TwitterVerificationHandler],
  controllers: [LinkVerificationsController],
  exports: [LinkVerificationsService],
})
export class LinkVerificationsModule {}
