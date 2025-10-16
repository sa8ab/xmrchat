import { Body, Controller, Get, Post } from '@nestjs/common';
import { InviteCohostDto } from './dtos/invite-cohost.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { CohostInvitationsService } from './cohost-invitations.service';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { CohostInvitationsRO } from './dtos/cohost-invitation.dto';

@Controller('cohost-invitations')
export class CohostInvitationsController {
  constructor(private cohostInvitationsService: CohostInvitationsService) {}

  @Post('')
  inviteCohost(@Body() dto: InviteCohostDto, @CurrentUser() user: User) {
    return this.cohostInvitationsService.inviteCohost(dto.email, user.id);
  }

  @Get('')
  @Serialize(CohostInvitationsRO)
  async findMyInvitations(@CurrentUser() user: User) {
    const res = await this.cohostInvitationsService.findMySentInvitations(user);
    return { cohostInvitations: res };
  }
}
