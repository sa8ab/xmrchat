import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { PageRecipientsService } from './page-recipients.service';
import { UpdateRecipientsDto } from './dtos/update-recipient.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/shared/constants';

@Controller('page-recipients')
export class PageRecipientsController {
  constructor(
    private pageRecipientsService: PageRecipientsService,
    private casl: CaslAbilityFactory,
  ) {}

  @Get('/')
  async findMyRecipients(@CurrentUser() user: User) {
    const recipients = await this.pageRecipientsService.findMyRecipients(user);

    return {
      recipients,
    };
  }

  @Post('/')
  async updateRecipients(
    @Body() dto: UpdateRecipientsDto,
    @CurrentUser() user: User,
  ) {
    const ability = this.casl.createForUser(user);
    if (!ability.can(Action.Update, 'recipient')) {
      throw new UnauthorizedException('Unauthorized to change recipients');
    }

    await this.pageRecipientsService.updateRecipients(dto, user);
    return { message: 'Recipients updated.' };
  }
}
