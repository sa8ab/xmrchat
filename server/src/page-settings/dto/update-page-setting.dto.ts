import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PageSettingKey } from 'src/shared/constants/enum';
import { IsValidSetting } from 'src/shared/validations/page-setting.validator';

export class UpdatePageSettingBaseDto {
  @IsEnum(PageSettingKey)
  key: PageSettingKey;

  @IsValidSetting()
  @IsOptional()
  value: any;
}

export class UpdatePageSettingDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePageSettingBaseDto)
  settings: UpdatePageSettingBaseDto[];
}
