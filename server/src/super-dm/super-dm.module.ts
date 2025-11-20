import { Module } from '@nestjs/common';
import { SuperDmService } from './super-dm.service';
import { SuperDmController } from './super-dm.controller';

@Module({
  providers: [SuperDmService],
  controllers: [SuperDmController]
})
export class SuperDmModule {}
