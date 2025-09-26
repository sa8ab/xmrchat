import { Module } from '@nestjs/common';
import { ChangeRoleCommand } from './commands/change-role.command';
import { AuthModule } from 'src/auth/auth.module';
import { FixtureCommand } from './commands/fixture.command';
import { UsersModule } from 'src/users/users.module';
import { ChangeEmailCommand } from './commands/change-email.command';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SendEmailCommand } from './commands/send-email.command';
import { LwsCommand } from './commands/lws.command';
import { LwsModule } from 'src/lws/lws.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from 'src/pages/page.entity';
import { DataMigrationCommand } from './commands/data-migration.command';
import { Tip } from 'src/tips/tip.entity';
import { ChangePremiumCommand } from './commands/premium.command';
import { PagesModule } from 'src/pages/pages.module';
import { Payment } from 'src/payments/payment.entity';
import { User } from 'src/users/user.entity';
import { File } from 'src/files/file.entity';
import { ConfigCommand } from './commands/config.command';
import { TwitchModule } from 'src/integrations/twitch/twitch.module';

@Module({
  providers: [
    ChangeRoleCommand,
    FixtureCommand,
    ChangeEmailCommand,
    SendEmailCommand,
    LwsCommand,
    DataMigrationCommand,
    ChangePremiumCommand,
    ConfigCommand,
  ],
  imports: [
    AuthModule,
    PagesModule,
    UsersModule,
    NotificationsModule,
    LwsModule,
    TypeOrmModule.forFeature([Page, Tip, Payment, User, File]),
    TwitchModule,
  ],
})
export class CommanderModule {}
