import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Command, CommandRunner, Option } from 'nest-commander';
import { Page } from 'src/pages/page.entity';
import { Tip } from 'src/tips/tip.entity';
import { Repository } from 'typeorm';

@Command({
  name: 'data-migration',
  description: 'Runs data migrations',
})
export class DataMigrationCommand extends CommandRunner {
  private logger = new Logger(DataMigrationCommand.name);

  constructor(
    @InjectRepository(Page) private readonly pagesRepo: Repository<Page>,
    @InjectRepository(Tip) private readonly tipsRepo: Repository<Tip>,
  ) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    this.logger.log('options', options);
    if (options.migration === 'page-tip-display') {
      await this.migratePageTipDisplay();
      this.logger.log(
        'Change the values in defaultTipAmountDisplay to tipDisplayMode',
      );
      return;
    }

    if (options.migration === 'add-expires-at-to-tips') {
      await this.addExpiresAtToTips();
      this.logger.log('Added expiresAt to tips');
      return;
    }

    this.logger.error('Migration is not specified');
  }

  @Option({
    flags: '-m, --migration [migration]',
    description: 'Migration to run',
  })
  parseMigration(val: string) {
    return val;
  }

  async migratePageTipDisplay() {
    const query = this.pagesRepo
      .createQueryBuilder('page')
      .update()
      .set({
        tipDisplayMode: () =>
          `CASE WHEN default_tip_amount_display = 'usd' THEN 'fiat' ELSE default_tip_amount_display END`,
      });

    await query.execute();
  }

  async addExpiresAtToTips() {
    const query = this.tipsRepo
      .createQueryBuilder()
      .update()
      .where('expires_at IS NULL')
      .set({ expiresAt: () => 'NOW()' });

    await query.execute();
  }
}
