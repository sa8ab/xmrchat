import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PagesService } from 'src/pages/pages.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TestService {
  private logger = new Logger(TestService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly pagesService: PagesService,
    private readonly configService: ConfigService,
  ) {}

  async init() {
    const isTestEnv = this.configService.get('TEST_ENV');
    if (!isTestEnv) return;

    await this.createTestUser();
  }

  async createTestUser() {
    this.logger.log('Creating test user..');
    const exists = await this.usersService.findByEmail('test@test.com');
    if (exists) return;

    const user = await this.usersService.createUser({
      email: 'test@test.com',
      password: 'password',
      language: 'en',
      isEmailVerified: true,
    });

    return user;
  }
}
