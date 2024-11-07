import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { MoneroNetworkType, MoneroUtils } from 'monero-ts';

@ValidatorConstraint({ name: 'customText', async: true })
export class IsMoneroPrimaryAdrress implements ValidatorConstraintInterface {
  async validate(text: string, args: ValidationArguments) {
    return MoneroUtils.isValidAddress(text, MoneroNetworkType.MAINNET);
  }

  defaultMessage() {
    return 'Primary address is invalid';
  }
}
