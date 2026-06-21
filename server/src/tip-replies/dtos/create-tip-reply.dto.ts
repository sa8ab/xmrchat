import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTipReplyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  message: string;
}
