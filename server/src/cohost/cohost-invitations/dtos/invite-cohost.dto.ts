import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class InviteCohostDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}
