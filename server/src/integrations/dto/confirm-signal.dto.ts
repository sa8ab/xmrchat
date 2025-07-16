import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ConfirmSignalDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
