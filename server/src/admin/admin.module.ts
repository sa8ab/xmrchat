import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PagesModule } from 'src/pages/pages.module';
import { AdminPagesController } from './admin-pages.controller';
import { AdminUsersController } from './admin-users.controller';

@Module({
  imports: [PagesModule],
  controllers: [AdminController, AdminPagesController, AdminUsersController],
})
export class AdminModule {}
