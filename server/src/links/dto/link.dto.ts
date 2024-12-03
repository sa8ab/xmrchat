import { Expose, Type } from 'class-transformer';

export class LinkDto {
  @Expose()
  platform: string;

  @Expose()
  value: string;
}

export class LinkDtoRO {
  @Expose()
  @Type(() => LinkDto)
  links: LinkDto[];
}
