import { Expose, Type } from 'class-transformer';
import { AtomicToXmrTransform } from 'src/shared/decorators/atomic-to-xmr-transform.decorator';

export class PaidContentDto {
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
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class PaidContentRO {
  @Expose()
  @Type(() => PaidContentDto)
  paidContent: PaidContentDto;
}

export class PaidContentsRO {
  @Expose()
  @Type(() => PaidContentDto)
  paidContents: PaidContentDto[];
}
