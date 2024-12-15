import { Expose, Transform, Type } from 'class-transformer';
import {
  PageSettingCategory,
  PageSettingKey,
  PageSettingValueType,
} from 'src/shared/constants';

export class PageSettingDto {
  @Expose()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  value: string | boolean | null;

  @Expose()
  type: PageSettingValueType;

  @Expose()
  key: PageSettingKey;

  @Expose()
  category: PageSettingCategory;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class PageSettingRO {
  @Expose()
  @Type(() => PageSettingDto)
  settings: PageSettingDto[];
}
