import { Injectable, Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { AuthService } from 'src/auth/auth.service';

@Command({
  name: 'role',
  arguments: '<role>',
  description: 'Adds or removes admin roles',
})
export class AdminCommandService extends CommandRunner {
  private logger = new Logger(AdminCommandService.name);

  constructor(private readonly authService: AuthService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    this.logger.log({ passedParams, options });
  }

  @Option({
    flags: '-e, --email <email>',
    description: 'Email of the user to add/remove admin.',
    required: true,
  })
  parseUserPath(val: string) {
    return val;
  }

  @Option({
    flags: '-m, --mode [mode]',
    description: 'Add or remove the role',
    defaultValue: 'add',
  })
  parseMode(val: string) {
    return val;
  }
}
