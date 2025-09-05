import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'src/shared/validations/validation-decorators';

export class AuthDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @MaxLength(72)
  @MinLength(6)
  password: string;
}
