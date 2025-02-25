import { Module } from '@nestjs/common';
import { ChangeRoleCommand } from './change-role.command';
import { AuthModule } from 'src/auth/auth.module';
import { SeedCommand } from './seed.command';

@Module({
  providers: [ChangeRoleCommand, SeedCommand],
  imports: [AuthModule],
})
export class CommanderModule {}
