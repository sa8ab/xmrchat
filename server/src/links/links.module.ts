import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { PagesModule } from 'src/pages/pages.module';

@Module({
  imports: [PagesModule],
  providers: [LinksService],
  controllers: [LinksController],
})
export class LinksModule {}
