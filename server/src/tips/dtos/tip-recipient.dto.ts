import { Expose } from 'class-transformer';
import { PageRecipientDto } from 'src/page-recipients/dtos/recipient.dto';

export class TipRecipientDto extends PageRecipientDto {
  @Expose()
  amount: number;
}
