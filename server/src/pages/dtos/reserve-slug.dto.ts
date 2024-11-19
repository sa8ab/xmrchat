import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { CreatePageBaseDto } from './create-page-base.dto';

export class ReserveSlugDto extends CreatePageBaseDto {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Page can only include letters, numbers, underscores and hyphens',
  })
  path: string;
}
