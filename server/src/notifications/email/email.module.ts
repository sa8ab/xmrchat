import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => {
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
            adapter: new HandlebarsAdapter(),
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
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
