import { IsOptional, IsString } from 'class-validator';

export class UpdatePaidContentSettingDto {
  @IsString()
  @IsOptional()
  telegramUserId?: string;

  @IsString()
  @IsOptional()
  telegramPaidContentId?: string;
}
