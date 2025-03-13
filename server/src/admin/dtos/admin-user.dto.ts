import { Expose, Type } from 'class-transformer';
import { RolesEnum } from 'src/shared/constants';
import { UserDto } from 'src/users/dtos/user.dto';

export class AdminUserDto extends UserDto {}
