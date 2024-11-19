import { Expose, Type } from 'class-transformer';
import { PageDto } from './page.dto';

export class SearchPageDto {
  @Expose()
  @Type(() => PageDto)
  pages: PageDto[];

  @Expose()
  total: number;
}
