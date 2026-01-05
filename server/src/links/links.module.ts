import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { PagesModule } from 'src/pages/pages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './link.entity';
import { LinkVerificationsModule } from 'src/link-verifications/link-verifications.module';

@Module({
  imports: [
    PagesModule,
    LinkVerificationsModule,
    TypeOrmModule.forFeature([Link]),
  ],
  providers: [LinksService],
  controllers: [LinksController],
  exports: [LinksService],
})
export class LinksModule {}
