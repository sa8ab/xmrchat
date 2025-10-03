import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  CliUtilityService,
  Command,
  CommandRunner,
  Option,
} from 'nest-commander';
import { PagesService } from 'src/pages/pages.service';
import { UsersService } from 'src/users/users.service';

@Command({
  name: 'change-premium',
  arguments: '<status>',
  description: 'Changes premium status of a user',
})
export class ChangePremiumCommand extends CommandRunner {
  private logger = new Logger(ChangePremiumCommand.name);

  constructor(
    private readonly pagesService: PagesService,
    private utils: CliUtilityService,
  ) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const status = passedParams[0];

    const isPremium = this.utils.parseBoolean(status);

    await this.pagesService.changePremiumBySlug(options.slug, isPremium);

    console.log(`Changed premium status of ${options.slug} to ${isPremium}`);
  }

  @Option({
    flags: '-s, --slug <slug>',
    description: 'Slug of the page to change premium status.',
    required: true,
  })
  parseUserPath(val: string) {
    return val;
  }
}
