import { Expose, Type } from 'class-transformer';
import { TipDto } from 'src/tips/dtos/tip.dto';

export class TipReplyDto {
  @Expose()
  id: number;

  @Expose()
  message: string;

  @Expose()
  createdAt: Date;
}

export class TipReplyDtoRO extends TipReplyDto {
  @Expose()
  @Type(() => TipDto)
  tip: TipDto;
}
