import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from 'src/pages/page.entity';
import { PagesService } from 'src/pages/pages.service';
import { FiatEnum } from 'src/shared/constants';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class TestService {
  private logger = new Logger(TestService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly pagesService: PagesService,
    private readonly configService: ConfigService,

    @InjectRepository(Page)
    private readonly pageRepo: Repository<Page>,
  ) {}

  async init() {
    const isTestEnv = this.configService.get('TEST_ENV');
    if (!isTestEnv) return;

    await this.createTestUser();
    await this.createPage();
  }

  async createTestUser(email: string = 'test@test.com') {
    this.logger.log(`Creating test user ${email}`);
    const exists = await this.usersService.findByEmail(email);
    if (exists) return;

    const user = await this.usersService.createUser({
      email,
      password: 'password',
      language: 'en',
      isEmailVerified: true,
    });

    return user;
  }

  async createPage() {
    const user = await this.createTestUser('user-with-page@test.com');

    const exists = await this.pageRepo.findOne({
      where: {
        path: 'test-page',
      },
    });

    if (exists) {
      this.logger.log('Test page already exists');
      return;
    }

    const createdPage = this.pageRepo.create({
      path: 'test-page',
      name: 'Test Page',
      primaryAddress:
        '45RVXPBdpGd91GMityvhXVCLs2RM1YQxcheCmvvSDuggZNauJVj7UPaC2qD4ubkNBcRxxoPe2VvEJ5Uuzrp8Hd4NEVdfEzJ',
      secretViewKey:
        'de87a42b9ad3e3044beea7ec41f1a8c76dc239cdd934e991118d7aeb790b6d0d',
      fiat: FiatEnum.USD,
      user,
    });

    await this.pageRepo.save(createdPage);
    this.logger.log('Test page created');
  }
}
