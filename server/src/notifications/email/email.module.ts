import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { I18nService } from 'nestjs-i18n';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService, I18nService],
      useFactory: (config: ConfigService, i18n: I18nService) => {
        const getTransport = () => {
          const isDev = process.env.NODE_ENV === 'development';
          return {
            host: isDev ? '0.0.0.0' : config.get('MAIL_HOST'),
            auth: isDev
              ? undefined
              : {
                  user: config.get('MAIL_USERNAME'),
                  pass: config.get('MAIL_PASSWORD'),
                },
            port: isDev ? 1025 : undefined,
            ignoreTLS: isDev ? false : true,
          };
        };

        return {
          transport: { ...getTransport() },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter({
              translate: (key: string, options: any): string => {
                const lang = options.hash.lang || 'en';

                return i18n.translate(key, { lang, args: options.hash.args });
              },
            }),
            options: {
              strict: true,
            },
          },
          options: {
            partials: {
              dir: join(__dirname, 'templates', 'partials'),
              options: {
                strict: true,
              },
            },
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
