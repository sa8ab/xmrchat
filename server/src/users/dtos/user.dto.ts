import { Expose, Type } from 'class-transformer';
import { PageDto } from 'src/pages/dtos/page.dto';
import { RolesEnum } from 'src/shared/constants';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: string;

  @Expose()
  isEmailVerified: boolean;

  @Expose()
  roles: RolesEnum[];

  @Expose()
  @Type(() => PageDto)
  cohostPage?: PageDto;
}
