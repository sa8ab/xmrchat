import { Controller, Get } from '@nestjs/common';
import { CohostService } from './cohost.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { PagesService } from 'src/pages/pages.service';
import { CohostsRO } from './dtos/cohost.dto';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { CohostPageRO } from './dtos/cohost-page.dto';

@Controller('cohosts')
export class CohostController {
  constructor(
    private cohostService: CohostService,
    private casl: CaslAbilityFactory,
    private pagesService: PagesService,
  ) {}

  @Get()
  @Serialize(CohostsRO)
  async findCohosts(@CurrentUser() user: User) {
    const page = await this.pagesService.findMyPage(user);

    const res = await this.cohostService.findPageCohosts(page.id);
    return {
      cohosts: res,
    };
  }

  @Get('my-page')
  @Serialize(CohostPageRO)
  async getMyCohostPage(@CurrentUser() user: User) {
    const page = await this.cohostService.getMyCohostPage(user);

    return {
      cohostPage: page,
    };
  }
}
