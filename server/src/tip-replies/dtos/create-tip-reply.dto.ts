import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTipReplyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}
