import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FilesModule } from './files/files.module';
import { PagesModule } from './pages/pages.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { LwsModule } from './lws/lws.module';
import { PaymentsModule } from './payments/payments.module';
import { TipsModule } from './tips/tips.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { PricesModule } from './prices/prices.module';
import { PageSettingsModule } from './page-settings/page-settings.module';
import { LinksModule } from './links/links.module';
import { TwitchModule } from './integrations/twitch.module';
import { SwapsModule } from './swaps/swaps.module';
import { TrocadorModule } from './integrations/trocador/trocador.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuditsModule } from './audits/audits.module';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { join } from 'path';
import { ClsModule } from 'nestjs-cls';
import { ThrottlerModule } from '@nestjs/throttler';
import { CommanderModule } from './commander/commander.module';
import { AdminModule } from './admin/admin.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    CacheModule.registerAsync({
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: config.get('REDIS_HOST'),
            port: +config.get('REDIS_PORT'),
          },
        });

        return {
          store: store as unknown as CacheStore,
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: 'logs/log.log',
        }),
      ],
      format: winston.format.combine(
        winston.format.timestamp({}),
        winston.format.json(),
        winston.format.simple(),
      ),
    }),
    ClsModule.forRoot({
      middleware: { mount: true },
      global: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120,
      },
    ]),
    I18nModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          fallbackLanguage: config.get('DEFAULT_LOCALE') || 'en',
          loaderOptions: {
            path: join(__dirname, '/i18n/'),
            watch: true,
          },
        };
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    UsersModule,
    DatabaseModule,
    NotificationsModule,
    FilesModule,
    PagesModule,
    LwsModule,
    PaymentsModule,
    TipsModule,
    WebhooksModule,
    PricesModule,
    PageSettingsModule,
    LinksModule,
    TwitchModule,
    SwapsModule,
    TrocadorModule,
    AuditsModule,
    CommanderModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
