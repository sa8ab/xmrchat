import { Module } from '@nestjs/common';
import { ChangeRoleCommand } from './commands/change-role.command';
import { AuthModule } from 'src/auth/auth.module';
import { SeedCommand } from './commands/seed.command';
import { UsersModule } from 'src/users/users.module';
import { ChangeEmailCommand } from './commands/change-email.command';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SendEmailCommand } from './commands/send-email.command';

@Module({
  providers: [
    ChangeRoleCommand,
    SeedCommand,
    ChangeEmailCommand,
    SendEmailCommand,
  ],
  imports: [AuthModule, UsersModule, NotificationsModule],
})
export class CommanderModule {}
