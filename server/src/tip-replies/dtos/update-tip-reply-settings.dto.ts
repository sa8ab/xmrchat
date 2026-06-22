import { IsHexColor } from 'class-validator';

export class UpdateTipReplySettingsDto {
  @IsHexColor()
  backgroundColor: string;

  @IsHexColor()
  textColor: string;
}
