import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { PagesService } from 'src/pages/pages.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { LinksService } from './links.service';
import { UpdateLinksDto } from './dto/update-links.dto';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { LinkDtoRO } from './dto/link.dto';

@Controller('links')
export class LinksController {
  constructor(
    private linksService: LinksService,
    private pagesService: PagesService,
  ) {}

  @Get('/me')
  @Serialize(LinkDtoRO)
  async getMyLinks(@CurrentUser() user: User) {
    const page = await this.pagesService.findMyPage(user);

    if (!page) throw new NotFoundException('Page is not found.');

    if (page.userId !== user.id) throw new UnauthorizedException();

    const links = await this.linksService.findByPageId(page.id);

    return { links, name: page.name, searchTerms: page.searchTerms };
  }

  @Put('/me')
  async updateMyContentLinks(
    @CurrentUser() user: User,
    @Body() body: UpdateLinksDto,
  ) {
    const page = await this.pagesService.findMyPage(user);

    if (!page) throw new NotFoundException('Page is not found.');

    if (page.userId !== user.id) throw new UnauthorizedException();

    await this.linksService.updateContentLinks(body, page);

    return { message: 'Content Links updated.' };
  }
}
