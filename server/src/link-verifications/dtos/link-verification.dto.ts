import { Expose, Type } from 'class-transformer';

export class LinkVerificationDto {
  @Expose()
  id: number;

  @Expose()
  url: string;
}

export class LinkVerificationRo {
  @Expose()
  @Type(() => LinkVerificationDto)
  linkVerification: LinkVerificationDto;
}
