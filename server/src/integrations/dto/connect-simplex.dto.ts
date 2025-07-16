import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectSimplexDto {
  @IsString()
  @IsNotEmpty()
  address: string;
}
