import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { PagesModule } from 'src/pages/pages.module';
import { UsersModule } from 'src/users/users.module';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from 'src/pages/page.entity';
import { Payment } from 'src/payments/payment.entity';

@Module({
  imports: [
    PagesModule,
    UsersModule,
    TypeOrmModule.forFeature([Page, Payment]),
  ],
  providers: [TestService],
  controllers: [TestController],
})
export class TestModule {}
