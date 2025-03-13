import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { isEmail, isEnum } from 'class-validator';
import { Command, CommandRunner, Option } from 'nest-commander';
import { AuthService } from 'src/auth/auth.service';
import { RolesEnum } from 'src/shared/constants';
import { UsersService } from 'src/users/users.service';

@Command({
  name: 'change-email',
  description: 'Change email of user',
})
export class ChangeEmailCommand extends CommandRunner {
  private logger = new Logger(ChangeEmailCommand.name);

  constructor(private readonly usersService: UsersService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const emailFrom = options.emailFrom;
    const emailTo = options.emailTo;

    await this.usersService.changeEmail(emailFrom, emailTo);
    this.logger.log(`Email of user is changed from ${emailFrom} to ${emailTo}`);
  }

  @Option({
    flags: '-e, --email-from <emailFrom>',
    description: 'Email of the user to change.',
    required: true,
  })
  parseUserPath(val: string) {
    if (!isEmail(val)) throw new Error('Email is invalid');
    return val;
  }

  @Option({
    flags: '-t, --email-to <emailTo>',
    description: 'The email to change to',
    required: true,
  })
  parseMode(val: string) {
    if (!isEmail(val)) throw new Error('Email is invalid');
    return val;
  }
}
