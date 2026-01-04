import { Expose, Type } from 'class-transformer';
import { PageVerificationTypeEnum } from 'src/shared/constants';

export class PageVerificationDto {
  @Expose()
  id: number;

  @Expose()
  type: PageVerificationTypeEnum;

  @Expose()
  url: string;

  @Expose()
  createdAt: Date;
}

export class PageVerificationRo {
  @Expose()
  @Type(() => PageVerificationDto)
  pageVerification: PageVerificationDto;
}

export class PageVerificationsRo {
  @Expose()
  @Type(() => PageVerificationDto)
  pageVerifications: PageVerificationDto[];
}
