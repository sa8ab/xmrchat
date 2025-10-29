import { Exclude, Expose, Type } from 'class-transformer';
import { PageDto } from 'src/pages/dtos/page.dto';

export class CohostPageDto extends PageDto {}

export class CohostPageRO {
  @Expose()
  @Type(() => CohostPageDto)
  cohostPage: CohostPageDto;
}
