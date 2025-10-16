import { Module } from '@nestjs/common';
import { CohostInvitationsService } from './cohost-invitations.service';
import { CohostInvitationsController } from './cohost-invitations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Page } from 'src/pages/page.entity';
import { CohostInvitation } from './entities/cohost-invitation.entity';
import { PagesModule } from 'src/pages/pages.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Page, CohostInvitation]),
    PagesModule,
    NotificationsModule,
  ],
  providers: [CohostInvitationsService],
  controllers: [CohostInvitationsController],
})
export class CohostInvitationsModule {}
