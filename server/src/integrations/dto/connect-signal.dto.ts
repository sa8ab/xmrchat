import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ConnectSignalDto {
  @IsString()
  @IsNotEmpty()
  number: string;
}
