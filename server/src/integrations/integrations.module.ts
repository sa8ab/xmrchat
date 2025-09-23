import { Module } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { SimplexModule } from './simplex/simplex.module';
import { SignalModule } from './signal/signal.module';
import { IntegrationsController } from './integrations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationConfig } from './integration-configs.entity';
import { PagesModule } from 'src/pages/pages.module';
import { YoutubeModule } from './youtube/youtube.module';

@Module({
  providers: [IntegrationsService],
  imports: [
    SimplexModule,
    SignalModule,
    PagesModule,
    TypeOrmModule.forFeature([IntegrationConfig]),
    YoutubeModule,
  ],
  exports: [SimplexModule, SignalModule],
  controllers: [IntegrationsController],
})
export class IntegrationsModule {}
