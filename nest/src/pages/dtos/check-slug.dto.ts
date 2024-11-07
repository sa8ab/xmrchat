import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CheckSlugDto {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Page can only include letters, numbers, underscores and hyphens',
  })
  slug: string;
}
