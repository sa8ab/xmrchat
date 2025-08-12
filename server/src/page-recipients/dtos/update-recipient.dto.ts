import {
  IsEnum,
  IsNumber,
  IsString,
  Validate,
  ValidateIf,
} from 'class-validator';
import { PageRecipientVariant } from 'src/shared/constants';
import { IsMoneroPrimaryAdrress } from 'src/shared/validations/monero-primary-address.validation';

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
