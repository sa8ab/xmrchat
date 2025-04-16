import { Module } from '@nestjs/common';
import { ChangeRoleCommand } from './commands/change-role.command';
import { AuthModule } from 'src/auth/auth.module';
import { SeedCommand } from './commands/seed.command';
import { UsersModule } from 'src/users/users.module';
import { ChangeEmailCommand } from './commands/change-email.command';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SendEmailCommand } from './commands/send-email.command';
import { LwsCommand } from './commands/lws.command';
import { LwsModule } from 'src/lws/lws.module';

@Module({
  providers: [
    ChangeRoleCommand,
    SeedCommand,
    ChangeEmailCommand,
    SendEmailCommand,
    LwsCommand,
  ],
  imports: [AuthModule, UsersModule, NotificationsModule, LwsModule],
})
export class CommanderModule {}
