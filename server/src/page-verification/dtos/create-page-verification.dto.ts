import { IsEnum, IsString, IsUrl } from 'class-validator';
import { PageVerificationTypeEnum } from 'src/shared/constants';

export class CreatePageVerificationDto {
  @IsEnum(PageVerificationTypeEnum)
  type: PageVerificationTypeEnum;

  @IsString()
  @IsUrl()
  url: string;
}
