import { Controller, Get } from '@nestjs/common';
import { PagesService } from 'src/pages/pages.service';
import { RolesEnum } from 'src/shared/constants';
import { Roles } from 'src/shared/decorators/roles.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly pagesServices: PagesService) {}

  @Get('/pages')
  @Roles(RolesEnum.ADMIN)
  getPages() {
    return this.pagesServices.adminPages();
  }
}
