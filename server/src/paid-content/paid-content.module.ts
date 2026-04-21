import { Module } from '@nestjs/common';
import { PaidContentService } from './paid-content.service';
import { PaidContentController } from './paid-content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaidContent } from './paid-content.entity';
import { PagesModule } from 'src/pages/pages.module';

@Module({
  imports: [TypeOrmModule.forFeature([PaidContent]), PagesModule],
  providers: [PaidContentService],
  controllers: [PaidContentController],
})
export class PaidContentModule {}
