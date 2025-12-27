import { Expose, Type } from 'class-transformer';
import { PageRecipientVariant } from 'src/shared/constants';

export class PageRecipientDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  percentage: number;

  @Expose()
  variant: PageRecipientVariant;
}

export class PageRecipientShareDto extends PageRecipientDto {
  @Expose()
  amount: number;
}

export class PageRecipientsDto {
  @Expose()
  @Type(() => PageRecipientDto)
  recipients: PageRecipientDto[];
}
