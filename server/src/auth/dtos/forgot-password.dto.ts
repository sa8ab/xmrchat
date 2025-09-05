import { Transform } from 'class-transformer';
import { IsEmail } from 'src/shared/validations/validation-decorators';

export class ForgotPasswordDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}
