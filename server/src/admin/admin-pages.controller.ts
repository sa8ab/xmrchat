import { Controller, Get, Query } from '@nestjs/common';
import { RolesEnum } from 'src/shared/constants';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { PageSearchAdminRO } from './dtos/admin-page.dto';
import { PagesService } from 'src/pages/pages.service';

@Controller('/admin')
export class AdminPagesController {
  constructor(private readonly pagesServices: PagesService) {}

  @Get('/pages')
  @Roles(RolesEnum.ADMIN)
  @Serialize(PageSearchAdminRO)
  getPages(@Query() query: any) {
    const slug = query.search;
    const offset = query.offset;
    const limit = query.limit;
    return this.pagesServices.adminSearchPages(slug, offset, limit);
  }
}
