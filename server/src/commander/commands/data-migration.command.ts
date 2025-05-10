import { Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';

@Command({
  name: 'data-migration',
  description: 'Runs data migrations',
})
export class DataMigrationCommand extends CommandRunner {
  private logger = new Logger(DataMigrationCommand.name);

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {}

  @Option({
    flags: '-m, --migration [migration]',
    description: 'Migration to run',
  })
  parseMigration(val: string) {
    return val;
  }

  async migratePageTipDisplay() {}
}
