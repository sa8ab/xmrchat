import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import datasource from '../../typeorm.config';
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
    this.logger.log('Command run');

    const dataSource = await datasource.initialize();

    this.logger.log('After initialize');

    await runSeeders(dataSource);
  }
}
