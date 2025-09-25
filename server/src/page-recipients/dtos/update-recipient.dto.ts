import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsString,
  Max,
  Min,
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

  @IsInt()
  @Transform(({ value }) => Number(value))
  @Min(0)
  @Max(100)
  percentage: number;

  @IsEnum(PageRecipientVariant)
  variant: PageRecipientVariant;
}

export class UpdateRecipientsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  @Type(() => UpdateRecipientDto)
  @Validate(IsValidRecipients)
  recipients: UpdateRecipientDto[];
}
