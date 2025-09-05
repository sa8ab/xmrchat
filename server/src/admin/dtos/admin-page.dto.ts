import { Expose, Type } from 'class-transformer';
import { StreamerPageDto } from 'src/pages/dtos/streamer-page.dto';
import { AdminUserDto } from './admin-user.dto';

export class AdminPageDto extends StreamerPageDto {
  @Expose()
  totalTips: number;

  @Expose()
  tipsCount: number;

  @Expose()
  @Type(() => AdminUserDto)
  user: AdminUserDto;
}

export class PageSearchAdminRO {
  @Expose()
  @Type(() => AdminPageDto)
  pages: AdminPageDto[];

  @Expose()
  total: number;
}

export class AdminPageRO {
  @Expose()
  @Type(() => AdminPageDto)
  page: AdminPageDto;
}
