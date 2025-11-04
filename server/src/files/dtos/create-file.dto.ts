import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { FileType } from 'src/shared/constants';

export class CreateFileDto {
  @IsString()
  filename: string;

  @IsString()
  originalName: string;

  @IsEnum(FileType)
  type: FileType;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;
}
