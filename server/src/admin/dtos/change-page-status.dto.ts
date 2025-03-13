import { IsEnum } from 'class-validator';
import { PageStatusEnum } from 'src/shared/constants';

export class ChangePageStatusDto {
  @IsEnum(PageStatusEnum)
  status: PageStatusEnum;
}
