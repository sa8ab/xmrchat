import { Module } from '@nestjs/common';
import { ChangeRoleCommand } from './change-role.command';
import { AuthModule } from 'src/auth/auth.module';
import { SeedCommand } from './seed.command';
import { UsersModule } from 'src/users/users.module';
import { ChangeEmailCommand } from './commands/change-email.command';

@Module({
  providers: [ChangeRoleCommand, SeedCommand, ChangeEmailCommand],
  imports: [AuthModule, UsersModule],
})
export class CommanderModule {}
