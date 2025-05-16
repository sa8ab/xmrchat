import { IsString } from 'class-validator';
import { MinLength } from 'src/shared/validations/validation-decorators';

export class ResetPasswordDto {
  @IsString()
  @MinLength(6)
  password: string;
}
