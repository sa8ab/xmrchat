import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { MoneroUtils } from 'monero-ts';

@ValidatorConstraint({ name: 'customText', async: true })
export class IsMoneroSecretView implements ValidatorConstraintInterface {
  async validate(text: string, args: ValidationArguments) {
    return MoneroUtils.isValidPrivateViewKey(text);
  }

  defaultMessage() {
    return 'Secret View Key is invalid';
  }
}
