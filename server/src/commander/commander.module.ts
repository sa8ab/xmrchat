import { Module } from '@nestjs/common';
import { ChangeRoleCommand } from './change-role.command';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ChangeRoleCommand],
  imports: [AuthModule],
})
export class CommanderModule {}
