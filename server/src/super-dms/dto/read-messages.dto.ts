import { SuperDmMessageSenderType } from 'src/shared/constants';

export class ReadMessagesDto {
  superDmId: string;
  senderType: SuperDmMessageSenderType;
  signature: string;
  date: string;
}
