import { IsString, IsUrl } from 'class-validator';

export class CreateLinkVerificationDto {
  @IsString()
  @IsUrl()
  url: string;
}
