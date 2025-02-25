import { Module } from '@nestjs/common';
import { AdminCommandService } from './admin-command.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [AdminCommandService],
  imports: [AuthModule],
})
export class CommanderModule {}
