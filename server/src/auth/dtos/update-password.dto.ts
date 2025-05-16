import { IsString } from 'class-validator';
import { MinLength } from 'src/shared/validations/validation-decorators';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  currentPassword: string;
}
