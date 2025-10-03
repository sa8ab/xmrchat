import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PagesModule } from 'src/pages/pages.module';
import { AdminPagesController } from './admin-pages.controller';
import { AdminUsersController } from './admin-users.controller';
import { UsersModule } from 'src/users/users.module';
import { LiveStreamsModule } from 'src/live-streams/live-streams.module';

@Module({
  imports: [PagesModule, UsersModule, LiveStreamsModule],
  controllers: [AdminController, AdminPagesController, AdminUsersController],
})
export class AdminModule {}
