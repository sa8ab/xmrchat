import { IsEmail } from 'src/shared/validations/validation-decorators';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}
