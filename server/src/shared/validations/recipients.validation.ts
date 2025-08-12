import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PageRecipientVariant } from '../constants';

interface RecipientItem {
  variant: PageRecipientVariant;
  address?: string;
  percentage: number;
}

@ValidatorConstraint({ name: 'recipientsValidator', async: false })
export class IsValidRecipients implements ValidatorConstraintInterface {
  validate(recipients: RecipientItem[], args: ValidationArguments) {
    if (!Array.isArray(recipients)) {
      return false;
    }

    // Check if PAGE and XMRCHAT variants exist exactly once each
    const pageCount = recipients.filter(
      (r) => r.variant === PageRecipientVariant.PAGE,
    ).length;
    const xmrchatCount = recipients.filter(
      (r) => r.variant === PageRecipientVariant.XMRCHAT,
    ).length;

    if (pageCount !== 1 || xmrchatCount !== 1) {
      return false;
    }

    // Check that PAGE and XMRCHAT items don't have addresses
    const pageItem = recipients.find(
      (r) => r.variant === PageRecipientVariant.PAGE,
    );
    const xmrchatItem = recipients.find(
      (r) => r.variant === PageRecipientVariant.XMRCHAT,
    );

    if (pageItem?.address || xmrchatItem?.address) {
      return false;
    }

    // Check for duplicate addresses (excluding PAGE and XMRCHAT which shouldn't have addresses)
    const addresses = recipients
      .filter((r) => r.variant === PageRecipientVariant.RECIPIENT && r.address)
      .map((r) => r.address);

    const uniqueAddresses = new Set(addresses);
    if (addresses.length !== uniqueAddresses.size) {
      return false;
    }

    // Check that percentages sum to 100
    const totalPercentage = recipients.reduce(
      (sum, r) => sum + r.percentage,
      0,
    );
    if (Math.abs(totalPercentage - 100) > 0.01) {
      // Allow for small floating point precision issues
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const recipients = args.value as RecipientItem[];

    if (!Array.isArray(recipients)) {
      return 'Recipients must be an array';
    }

    const pageCount = recipients.filter(
      (r) => r.variant === PageRecipientVariant.PAGE,
    ).length;
    const xmrchatCount = recipients.filter(
      (r) => r.variant === PageRecipientVariant.XMRCHAT,
    ).length;

    if (pageCount !== 1 || xmrchatCount !== 1) {
      return 'Recipients must contain exactly one PAGE and one XMRCHAT variant';
    }

    const pageItem = recipients.find(
      (r) => r.variant === PageRecipientVariant.PAGE,
    );
    const xmrchatItem = recipients.find(
      (r) => r.variant === PageRecipientVariant.XMRCHAT,
    );

    if (pageItem?.address || xmrchatItem?.address) {
      return 'PAGE and XMRCHAT variants should not have addresses';
    }

    const addresses = recipients
      .filter((r) => r.variant === PageRecipientVariant.RECIPIENT && r.address)
      .map((r) => r.address);

    const uniqueAddresses = new Set(addresses);
    if (addresses.length !== uniqueAddresses.size) {
      return 'Recipients cannot have duplicate addresses';
    }

    const totalPercentage = recipients.reduce(
      (sum, r) => sum + r.percentage,
      0,
    );
    if (Math.abs(totalPercentage - 100) > 0.01) {
      return `Total percentage must equal 100, got ${totalPercentage}`;
    }

    return 'Invalid recipients configuration';
  }
}
