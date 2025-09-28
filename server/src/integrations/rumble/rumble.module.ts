import { Module } from '@nestjs/common';
import { RumbleService } from './rumble.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({})],
  providers: [RumbleService],
  exports: [RumbleService],
})
export class RumbleModule {}
