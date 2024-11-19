import { IsBoolean } from 'class-validator';

export class UpdateTipDto {
  @IsBoolean()
  private: boolean;
}
