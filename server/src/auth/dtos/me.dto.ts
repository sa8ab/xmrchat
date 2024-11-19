import { Expose, Type } from 'class-transformer';
import { StreamerPageDto } from 'src/pages/dtos/streamer-page.dto';
import { UserDto } from 'src/users/dtos/user.dto';

export class MeRO {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => StreamerPageDto)
  page: StreamerPageDto;
}
