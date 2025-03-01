import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { RolesEnum } from 'src/shared/constants';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { PageSearchAdminRO } from './dtos/admin-page.dto';
import { PagesService } from 'src/pages/pages.service';

@Roles(RolesEnum.ADMIN)
@Controller('/admin/pages')
export class AdminPagesController {
  constructor(private readonly pagesServices: PagesService) {}

  @Get('/')
  @Serialize(PageSearchAdminRO)
  getPages(@Query() query: any) {
    const slug = query.search;
    const offset = query.offset;
    const limit = query.limit;
    return this.pagesServices.adminSearchPages(slug, offset, limit);
  }

  @Get('/:path')
  getPage(@Param('path') path: string) {
    if (!path) throw new NotFoundException();
    return this.pagesServices.findAdminPageByPath(path);
  }
}
