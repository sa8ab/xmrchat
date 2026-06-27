import { IsHexColor, IsOptional } from 'class-validator';

export class UpdateTipReplySettingsDto {
  @IsHexColor()
  @IsOptional()
  backgroundColor?: string;

  @IsHexColor()
  @IsOptional()
  textColor?: string;
}
