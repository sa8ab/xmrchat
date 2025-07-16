import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ConnectSignalDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  number: string;
}
