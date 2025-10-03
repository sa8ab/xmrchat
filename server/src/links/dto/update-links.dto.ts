import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { LinkPlatformEnum } from 'src/shared/constants';

export class UpdateLinksBaseDto {
  @IsEnum(LinkPlatformEnum)
  platform: LinkPlatformEnum;

  @IsString()
  @MaxLength(80)
  @IsOptional()
  value: string;
}

export class UpdateLinksDto {
  @IsString()
  @MaxLength(64)
  @IsOptional()
  name: string;

  @IsString()
  @MaxLength(224)
  @IsOptional()
  searchTerms: string;

  @IsString()
  @IsOptional()
  rumbleLiveStreamUrl?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateLinksBaseDto)
  links: UpdateLinksBaseDto[];
}
