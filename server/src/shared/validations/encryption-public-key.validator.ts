import {
  isString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import openpgp from 'openpgp';
import { getErrorMessage } from '../utils/errors';

@ValidatorConstraint({ async: true })
export class EncryptionPublicKeyValidator
  implements ValidatorConstraintInterface
{
  async validate(value: any, args: ValidationArguments) {
    if (!isString(value)) return false;
    try {
      const key = await openpgp.readKey({ armoredKey: value });
    } catch (error) {
      console.log(getErrorMessage(error));

      return false;
    }

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Encryption public key is invalid';
  }
}

export const IsEncryptionPublicKey = (
  validationOptions?: ValidationOptions,
) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isEncryptionPublicKey',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: EncryptionPublicKeyValidator,
    });
  };
};
