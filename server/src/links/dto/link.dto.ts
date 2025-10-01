import { Expose, Type } from 'class-transformer';

export class LinkDto {
  @Expose()
  platform: string;

  @Expose()
  value: string;
}

export class LinkDtoRO {
  @Expose()
  name: string;

  @Expose()
  searchTerms: string;

  @Expose()
  rumbleLiveStreamUrl: string;

  @Expose()
  @Type(() => LinkDto)
  links: LinkDto[];
}
