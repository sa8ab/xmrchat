import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { PagesModule } from 'src/pages/pages.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PagesModule, UsersModule],
  providers: [TestService],
})
export class TestModule {}
