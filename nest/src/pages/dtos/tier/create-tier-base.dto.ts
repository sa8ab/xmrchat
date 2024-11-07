import { IsNumberString, IsString, MaxLength } from 'class-validator';

export class CreateTierBaseDto {
  @IsString()
  @MaxLength(40)
  name: string;

  @IsString()
  @MaxLength(400)
  description: string;

  @IsNumberString()
  amount: string;
}
