import { Module } from '@nestjs/common';
import { CohostService } from './cohost.service';
import { CohostController } from './cohost.controller';
import { CohostInvitationsModule } from './cohost-invitations/cohost-invitations.module';

@Module({
  providers: [CohostService],
  controllers: [CohostController],
  imports: [CohostInvitationsModule]
})
export class CohostModule {}
