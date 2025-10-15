import { Module } from '@nestjs/common';
import { CohostInvitationsService } from './cohost-invitations.service';
import { CohostInvitationsController } from './cohost-invitations.controller';

@Module({
  providers: [CohostInvitationsService],
  controllers: [CohostInvitationsController]
})
export class CohostInvitationsModule {}
