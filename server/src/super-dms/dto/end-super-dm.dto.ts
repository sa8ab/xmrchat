import { IsDateString, IsEnum, IsString } from 'class-validator';
import { SuperDmMessageSenderType } from 'src/shared/constants';

export class EndSuperDmDto {
  @IsString()
  signature: string;

  @IsDateString()
  date: string;

  @IsEnum(SuperDmMessageSenderType)
  endedByType: SuperDmMessageSenderType;
}
