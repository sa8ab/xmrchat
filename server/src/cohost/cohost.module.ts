import { Module } from '@nestjs/common';
import { CohostService } from './cohost.service';
import { CohostController } from './cohost.controller';
import { CohostInvitationsModule } from './cohost-invitations/cohost-invitations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Page } from 'src/pages/page.entity';
import { PagesModule } from 'src/pages/pages.module';

@Module({
  imports: [
    CohostInvitationsModule,
    PagesModule,
    TypeOrmModule.forFeature([User, Page]),
  ],
  providers: [CohostService],
  controllers: [CohostController],
})
export class CohostModule {}
