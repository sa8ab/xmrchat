import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ConfirmDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
