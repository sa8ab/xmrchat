import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from 'src/auth/user-tokens/user-token.entity';
import { File as FileEntity } from 'src/files/file.entity';
import { Page } from 'src/pages/page.entity';
import { Tier } from 'src/pages/tier.entity';
import { Payment } from 'src/payments/payment.entity';
import { Tip } from 'src/tips/tip.entity';
import { User } from 'src/users/user.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService) => ({
        type: 'postgres',
        database: configService.get('DATABASE_NAME'),
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        entities: [User, UserToken, FileEntity, Page, Payment, Tip, Tier],
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
