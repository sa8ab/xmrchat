import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { UsersService } from 'src/users/users.service';

@Command({
  name: 'change-premium',
  arguments: '<status>',
  description: 'Changes premium status of a user',
})
export class ChangePremiumCommand extends CommandRunner {
  private logger = new Logger(ChangePremiumCommand.name);

  constructor(private readonly usersService: UsersService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const status = passedParams[0];
    if (status !== 'true' && status !== 'false') {
      throw new BadRequestException('Status must be "true" or "false"');
    }

    const isPremium = status === 'true';

    await this.usersService.changePremiumByEmail(options.email, isPremium);

    this.logger.log(
      `Changed premium status of ${options.email} to ${isPremium}`,
    );
  }

  @Option({
    flags: '-e, --email <email>',
    description: 'Email of the user to change premium status.',
    required: true,
  })
  parseUserPath(val: string) {
    return val;
  }
}
