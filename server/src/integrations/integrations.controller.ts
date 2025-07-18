import { Controller, Post, Body, Get } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { ConnectSimplexDto } from './dto/connect-simplex.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { IntegrationsRO } from './dto/integrations.dto';
import { ConnectSignalDto } from './dto/connect-signal.dto';
import { ConfirmDto } from './dto/confirm.dto';

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
    return { message: 'Connection request sent.' };
  }

  @Post('/confirm/simplex')
  async confirmSimplex(@Body() body: ConfirmDto, @CurrentUser() user: User) {
    await this.integrationsService.confirmSimplex(body, user);
    return { message: 'Simplex connected.' };
  }

  @Post('/disconnect/simplex')
  async disconnectSimplex(@CurrentUser() user: User) {
    await this.integrationsService.disconnectSimplex(user);
    return { message: 'Simplex disconnected.' };
  }

  @Post('/connect/signal')
  async connectSignal(
    @Body() body: ConnectSignalDto,
    @CurrentUser() user: User,
  ) {
    await this.integrationsService.connectSignal(body, user);
    return { message: 'Connected to Signal.' };
  }

  @Post('/confirm/signal')
  async confirmSignal(@Body() body: ConfirmDto, @CurrentUser() user: User) {
    await this.integrationsService.confirmSignal(body, user);
    return { message: 'Signal connected.' };
  }

  @Post('/disconnect/signal')
  async disconnectSignal(@CurrentUser() user: User) {
    await this.integrationsService.disconnectSignal(user);
    return { message: 'Signal disconnected.' };
  }
}
