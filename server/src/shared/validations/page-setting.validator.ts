import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  isBoolean,
  isString,
  isNumber,
  isEnum,
} from 'class-validator';
import { PageSettingKey, PageSettingValueType } from '../constants/enum';
import { getPageSettingType } from '../utils/settings';

export const IsValidSetting = (
  typeKey?: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isValidSetting',
      target: object.constructor,
      propertyName,
      constraints: [typeKey],
      validator: {
        validate: (value: any, args: ValidationArguments) => {
          const keyOfSetting = args.object[args.constraints[0] || 'key'];

          const typeOfSetting = getPageSettingType(keyOfSetting);

          if (typeOfSetting === PageSettingValueType.STRING)
            return isString(value);
          if (typeOfSetting === PageSettingValueType.NUMBER)
            return isNumber(value);
          if (typeOfSetting === PageSettingValueType.BOOLEAN)
            return isBoolean(value);

          return false;
        },
        defaultMessage: (args: ValidationArguments) => {
          const keyOfSetting = args.object[args.constraints[0] || 'key'];

          const property = args.property;
          const type = getPageSettingType(keyOfSetting);
          return `${property} must be a ${type}.`;
        },
      },
    });
  };
};
