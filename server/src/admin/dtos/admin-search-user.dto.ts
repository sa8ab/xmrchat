import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { AdminUserDto } from './admin-user.dto';

export class AdminSearchUserDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  offset?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;
}

export class AdminSearchUserRO {
  @Expose()
  @Type(() => AdminUserDto)
  users: AdminUserDto[];

  @Expose()
  count: number;
}
