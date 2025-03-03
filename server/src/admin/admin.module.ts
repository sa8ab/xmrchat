import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PagesModule } from 'src/pages/pages.module';
import { AdminPagesController } from './admin-pages.controller';
import { AdminUsersController } from './admin-users.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PagesModule, UsersModule],
  controllers: [AdminController, AdminPagesController, AdminUsersController],
})
export class AdminModule {}
