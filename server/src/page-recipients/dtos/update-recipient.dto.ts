import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { PageRecipientVariant } from 'src/shared/constants';
import { IsMoneroPrimaryAdrress } from 'src/shared/validations/monero-primary-address.validation';
import { IsValidRecipients } from 'src/shared/validations/recipients.validation';

export class UpdateRecipientDto {
  @ValidateIf((o) => o.variant === PageRecipientVariant.RECIPIENT)
  @IsString()
  name: string;

  @ValidateIf((o) => o.variant === PageRecipientVariant.RECIPIENT)
  @Validate(IsMoneroPrimaryAdrress)
  address: string;

  @IsNumber()
  percentage: number;

  @IsEnum(PageRecipientVariant)
  variant: PageRecipientVariant;
}

export class UpdateRecipientsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRecipientDto)
  @Validate(IsValidRecipients)
  recipients: UpdateRecipientDto[];
}
