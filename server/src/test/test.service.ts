import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { Page } from 'src/pages/page.entity';
import { PagesService } from 'src/pages/pages.service';
import { FiatEnum, FileType } from 'src/shared/constants';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class TestService {
  private logger = new Logger(TestService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly pagesService: PagesService,
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,

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

    const coverImage = await this.filesService.createFile({
      filename: 'test-cover-image.png',
      originalName: 'test-cover-image.png',
      type: FileType.PAGE_LOGO,
    });
    const logo = await this.filesService.createFile({
      filename: 'test-logo.png',
      originalName: 'test-logo.png',
      type: FileType.PAGE_LOGO,
    });

    const createdPage = this.pageRepo.create({
      path: 'test-page',
      name: 'Test Page',
      primaryAddress:
        '45ttFTPkNZrA9qar2tSQywaJZhLRri3YgLVeYbd3pApQYTQjYrRuB9LBCuJMp2fzNtS433ihrMQgZh16exFvNjz2Q3UTUEm',
      secretViewKey:
        'ea271297df7a01c42cb0a63879b4d7d3fc2f169449d92a7dd1eefe7261fe0202',
      fiat: FiatEnum.USD,
      user,
      coverImage,
      logo,
    });

    await this.pageRepo.save(createdPage);

    await this.pagesService.addLwsAccount({
      address: createdPage.primaryAddress,
      key: createdPage.secretViewKey,
    });

    this.logger.log('Test page created');
  }
}
