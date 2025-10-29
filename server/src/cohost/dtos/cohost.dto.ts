import { Expose, Type } from 'class-transformer';
import { UserDto } from 'src/users/dtos/user.dto';

export class CohostDto extends UserDto {}

export class CohostsRO {
  @Expose()
  @Type(() => CohostDto)
  cohosts: CohostDto[];
}
