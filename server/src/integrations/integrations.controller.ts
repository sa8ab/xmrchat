import { Controller, Post, Body } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { ConnectSimplexDto } from './dto/connect-simplex.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}
  @Post('/connect/simplex')
  async connectSimplex(
    @Body() body: ConnectSimplexDto,
    @CurrentUser() user: User,
  ) {
    return this.integrationsService.connectSimplex(body, user);
  }
}
