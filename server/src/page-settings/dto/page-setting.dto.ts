import { Expose, Transform, Type } from 'class-transformer';
import { MoneroUtils } from 'monero-ts';
import { FileDto } from 'src/files/dtos/file.dto';
import {
  PageSettingCategory,
  PageSettingKey,
  PageSettingValueType,
} from 'src/shared/constants';

export class PageSettingDto {
  @Expose()
  @Transform(({ value, obj }) => {
    if (obj.key === PageSettingKey.SUPER_DM_MIN_AMOUNT) {
      if (value) return MoneroUtils.atomicUnitsToXmr(value);
    }
    return value === 'true' ? true : value === 'false' ? false : value;
  })
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
