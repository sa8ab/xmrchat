import { Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import datasource from '../../../typeorm.config';
import { runSeeders } from 'typeorm-extension';

@Command({
  name: 'seed',
  description: 'Adds data to the database.',
})
export class SeedCommand extends CommandRunner {
  private logger = new Logger(SeedCommand.name);

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const dataSource = await datasource.initialize();

    await runSeeders(dataSource);

    this.logger.log('Command completed.');
  }

  @Option({
    flags: '-r, --reset [reset]',
    description: 'Reset database before running seeder',
  })
  parseReset(val: string) {
    return Boolean(val);
  }
}
