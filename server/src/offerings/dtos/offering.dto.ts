import { Expose, Type } from 'class-transformer';
import { OfferingTypeEnum } from 'src/shared/constants';
import { AtomicToXmrTransform } from 'src/shared/decorators/atomic-to-xmr-transform.decorator';

export class OfferingDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  duration: number;

  @Expose()
  @AtomicToXmrTransform()
  amount: string;

  @Expose()
  type: OfferingTypeEnum;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class OfferingRO {
  @Expose()
  @Type(() => OfferingDto)
  offering: OfferingDto;
}

export class OfferingsRO {
  @Expose()
  @Type(() => OfferingDto)
  offerings: OfferingDto[];
}
