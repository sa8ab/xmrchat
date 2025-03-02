import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseEnumPipe,
  Put,
  Query,
} from '@nestjs/common';
import { PageStatusEnum, RolesEnum } from 'src/shared/constants';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { AdminPageRO, PageSearchAdminRO } from './dtos/admin-page.dto';
import { PagesService } from 'src/pages/pages.service';
import { ChangePageStatusDto } from './dtos/change-page-status.dto';

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
  @Serialize(AdminPageRO)
  async getPage(@Param('path') path: string) {
    if (!path) throw new NotFoundException();
    const page = await this.pagesServices.findAdminPageByPath(path);
    return { page };
  }

  @Put('/:path/change-status')
  async changeStatus(
    @Param('path') path: string,
    @Body() body: ChangePageStatusDto,
  ) {
    const status = body.status;
    await this.pagesServices.changeStatus(path, status);
    return { message: 'Status changed.' };
  }
}
