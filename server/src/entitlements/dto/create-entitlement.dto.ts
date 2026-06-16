import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaidContentTypeEnum } from 'src/shared/constants';

export class CreateEntitlementDto {
  @IsString()
  path: string;

  @IsString()
  name: string;

  @IsNumber()
  duration: number;

  @IsString()
  amount: string;

  @IsEnum(PaidContentTypeEnum)
  type: PaidContentTypeEnum;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}
