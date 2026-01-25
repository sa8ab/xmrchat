import { Expose, Type } from 'class-transformer';
import { LinkVerificationDto } from 'src/link-verifications/dtos/link-verification.dto';

export class LinkDto {
  @Expose()
  platform: string;

  @Expose()
  value: string;

  @Expose()
  @Type(() => LinkVerificationDto)
  verification?: LinkVerificationDto;
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

export class LinkRO {
  @Expose()
  @Type(() => LinkDto)
  link: LinkDto;
}
