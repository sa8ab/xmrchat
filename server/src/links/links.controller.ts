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

@Controller('links')
export class LinksController {
  constructor(
    private linksService: LinksService,
    private pagesService: PagesService,
  ) {}

  @Get('/me')
  async getMyLinks(@CurrentUser() user: User) {
    const page = await this.pagesService.findMyPage(user);

    if (!page) throw new NotFoundException('Page is not found.');

    if (page.userId !== user.id) throw new UnauthorizedException();

    return this.linksService.findByPageId(page.id);
  }

  @Put('/me')
  async updateMyContentLinks(
    @CurrentUser() user: User,
    @Body() body: UpdateLinksDto,
  ) {}
}
