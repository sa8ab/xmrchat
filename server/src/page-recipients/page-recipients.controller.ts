import { Body, Controller, Post } from '@nestjs/common';
import { PageRecipientsService } from './page-recipients.service';
import { UpdateRecipientsDto } from './dtos/update-recipient.dto';

@Controller('page-recipients')
export class PageRecipientsController {
  constructor(private pageRecipientsService: PageRecipientsService) {}

  @Post('/')
  async updateRecipients(@Body() dto: UpdateRecipientsDto) {
    await this.pageRecipientsService.updateRecipients(dto);
    return { message: '' };
  }
}
