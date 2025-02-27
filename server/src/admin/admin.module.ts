import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PagesModule } from 'src/pages/pages.module';

@Module({
  imports: [PagesModule],
  controllers: [AdminController],
})
export class AdminModule {}
