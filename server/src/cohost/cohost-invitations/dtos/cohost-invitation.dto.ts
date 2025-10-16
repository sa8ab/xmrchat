import { Expose, Type } from 'class-transformer';
import { PageDto } from 'src/pages/dtos/page.dto';
import { CohostInvitationStatus } from 'src/shared/constants';
import { UserDto } from 'src/users/dtos/user.dto';

export class CohostInvitationDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => PageDto)
  page: PageDto;

  @Expose()
  status: CohostInvitationStatus;

  @Expose()
  expiresAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class CohostInvitationsRO {
  @Expose()
  @Type(() => CohostInvitationDto)
  cohostInvitations: CohostInvitationDto[];
}
