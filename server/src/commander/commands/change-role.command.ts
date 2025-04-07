import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { isEnum } from 'class-validator';
import { Command, CommandRunner, Option } from 'nest-commander';
import { AuthService } from 'src/auth/auth.service';
import { RolesEnum } from 'src/shared/constants';

@Command({
  name: 'change-role',
  arguments: '<role>',
  description: 'Adds or removes roles',
})
export class ChangeRoleCommand extends CommandRunner {
  private logger = new Logger(ChangeRoleCommand.name);

  constructor(private readonly authService: AuthService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const role = passedParams[0];
    if (!isEnum(role, RolesEnum))
      throw new BadRequestException('The role is invalid');

    await this.authService.changeRoleOfEmail(
      options.email,
      options.change,
      role as RolesEnum,
    );

    this.logger.log(
      `Changed role of ${options.email}. Change: ${options.change} - Role: ${role}`,
    );
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
    flags: '-c, --change <change>',
    description: 'Add or remove the role',
    defaultValue: 'add',
  })
  parseMode(val: string) {
    return val;
  }
}
