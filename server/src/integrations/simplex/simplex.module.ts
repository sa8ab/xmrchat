import { Module } from '@nestjs/common';
import { SimplexService } from './simplex.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationConfig } from '../integration-configs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IntegrationConfig])],
  providers: [SimplexService],
  exports: [SimplexService],
})
export class SimplexModule {}
