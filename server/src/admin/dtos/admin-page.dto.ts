import { Expose, Type } from 'class-transformer';
import { StreamerPageDto } from 'src/pages/dtos/streamer-page.dto';
import { UserDto } from 'src/users/dtos/user.dto';

export class AdminPageDto extends StreamerPageDto {
  @Expose()
  totalTips: number;

  @Expose()
  tipsCount: number;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}

export class PageSearchAdminRO {
  @Expose()
  @Type(() => AdminPageDto)
  pages: AdminPageDto[];

  @Expose()
  total: number;
}
