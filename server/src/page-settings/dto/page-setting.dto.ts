import { Expose, Transform, Type } from 'class-transformer';
import { FileDto } from 'src/files/dtos/file.dto';
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

  @Expose()
  @Type((options) => {
    if (options.object.key === PageSettingKey.OBS_SOUND) return FileDto;
    return undefined;
  })
  data: any;
}

export class PageSettingRO {
  @Expose()
  @Type(() => PageSettingDto)
  settings: PageSettingDto[];
}
