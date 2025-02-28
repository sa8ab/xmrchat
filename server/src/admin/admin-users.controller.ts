import { Controller, Get, Query } from '@nestjs/common';
import { RolesEnum } from 'src/shared/constants';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UsersService } from 'src/users/users.service';
import {
  AdminSearchUserDto,
  AdminSearchUserRO,
} from './dtos/admin-search-user.dto';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';

@Roles(RolesEnum.ADMIN)
@Controller('/admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @Serialize(AdminSearchUserRO)
  getAll(@Query() query: AdminSearchUserDto) {
    return this.usersService.searchUsers(query);
  }
}
