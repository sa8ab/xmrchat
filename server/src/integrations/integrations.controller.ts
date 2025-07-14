import { Controller, Post, Body, Get } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { ConnectSimplexDto } from './dto/connect-simplex.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { IntegrationsRO } from './dto/integrations.dto';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get('/')
  @Serialize(IntegrationsRO)
  async getIntegrations(@CurrentUser() user: User) {
    const result = await this.integrationsService.findAllConfigs(user);
    return { integrations: result };
  }

  @Post('/connect/simplex')
  async connectSimplex(
    @Body() body: ConnectSimplexDto,
    @CurrentUser() user: User,
  ) {
    await this.integrationsService.connectSimplex(body, user || undefined);
    return { message: 'Connection request sent' };
  }
}
