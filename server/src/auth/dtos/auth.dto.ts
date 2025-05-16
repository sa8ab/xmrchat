import {} from 'class-validator';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'src/shared/validations/validation-decorators';

export class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(72)
  @MinLength(6)
  password: string;
}
