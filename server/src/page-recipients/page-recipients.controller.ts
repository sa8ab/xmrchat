import { Body, Controller, Get, Post } from '@nestjs/common';
import { PageRecipientsService } from './page-recipients.service';
import { UpdateRecipientsDto } from './dtos/update-recipient.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('page-recipients')
export class PageRecipientsController {
  constructor(private pageRecipientsService: PageRecipientsService) {}

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
    await this.pageRecipientsService.updateRecipients(dto, user);
    return { message: 'Updated recipients' };
  }
}
