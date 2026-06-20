import { Expose, Type } from 'class-transformer';
import { TipDto } from 'src/tips/dtos/tip.dto';

export class TipReplyDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => TipDto)
  tip: TipDto;

  @Expose()
  message: string;

  @Expose()
  createdAt: Date;
}

export class TipReplyDtoRO {
  @Expose()
  @Type(() => TipReplyDto)
  tipReply: TipReplyDto;
}
