import { Expose } from 'class-transformer';
import { SuperDmMessageSenderType } from 'src/shared/constants';

export class SuperDmMessageDto {
  @Expose()
  id: number;

  @Expose()
  senderType: SuperDmMessageSenderType;

  @Expose()
  content: string;

  @Expose()
  read: boolean;

  @Expose()
  createdAt: string;
}
