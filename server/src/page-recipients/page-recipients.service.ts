import { Injectable } from '@nestjs/common';
import { UpdateRecipientsDto } from './dtos/update-recipient.dto';

@Injectable()
export class PageRecipientsService {
  updateRecipients(dto: UpdateRecipientsDto) {
    console.log(dto);
  }
}
