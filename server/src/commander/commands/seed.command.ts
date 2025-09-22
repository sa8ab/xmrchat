import { Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import datasource from '../../../typeorm.config';
import { runSeeders } from 'typeorm-extension';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from 'src/pages/page.entity';
import { Tip } from 'src/tips/tip.entity';
import { Payment } from 'src/payments/payment.entity';
import { User } from 'src/users/user.entity';
import { createFinalPassword } from 'src/shared/utils';
import { File } from 'src/files/file.entity';
import { FileType } from 'src/shared/constants/enum';

@Command({
  name: 'seed',
  description: 'Adds data to the database.',
})
export class SeedCommand extends CommandRunner {
  private logger = new Logger(SeedCommand.name);

  constructor(
    @InjectRepository(Page) private readonly pagesRepo: Repository<Page>,
    @InjectRepository(Tip) private readonly tipsRepo: Repository<Tip>,
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(File) private readonly filesRepo: Repository<File>,
  ) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const email = 'dev@dev.com';
    const password = 'password';
    const pagePath = 'dev-page';

    const user = await this.createUser(email, password);
    const page = await this.createPage({ path: pagePath, user });

    // const dataSource = await datasource.initialize();

    // await runSeeders(dataSource);
  }

  @Option({
    flags: '-r, --reset [reset]',
    description: 'Reset database before running seeder',
  })
  parseReset(val: string) {
    return Boolean(val);
  }

  async createUser(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (user) {
      this.logger.warn(`User with email ${email} already exists.`);
      return user;
    }

    const created = this.usersRepo.create({
      email,
      isEmailVerified: true,
      username: email,
      password: createFinalPassword(password),
    });

    const result = await this.usersRepo.save(created);
    this.logger.log(`New user created. Email: ${email}, Password: ${password}`);
    return result;
  }

  async createPage({ path, user }: { path: string; user: User }) {
    const page = await this.pagesRepo.findOne({ where: { path } });
    if (page) {
      this.logger.warn(`Page with slug ${path} already exists.`);
      return page;
    }

    const createdImage = this.filesRepo.create({
      filename: 'image.png',
      originalName: 'image.png',
      url: 'image.png',
      type: FileType.PAGE_LOGO,
    });
    const image = await this.filesRepo.save(createdImage);

    const created = this.pagesRepo.create({
      user: { id: user.id },
      path,
      name: '',
      primaryAddress:
        '441irpz1gsYigGZ2DvfZQM238QsghPeZYQL8rGndC61PdbQMuRjx3TFRdtU8Q9ZvhVhbs3w66ykag8DM9cvQSMwgSqH4hre',
      secretViewKey:
        '74a98fbdd33e4b28915f67d9d17bd4c6fc9e0b1e3740bc2e0dcbf3d8b71d3301',
      coverImage: { id: image.id },
      logo: { id: image.id },
    });

    const result = await this.pagesRepo.save(created);
    this.logger.log(`New page created. Path: ${path}`);
    return result;
  }
}
