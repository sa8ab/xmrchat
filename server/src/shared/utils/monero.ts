import { base58xmr } from '@scure/base';
import { keccak_256 } from '@noble/hashes/sha3';
import { bytesToHex, randomBytes, hexToBytes } from '@noble/hashes/utils';
import { TipRecipientDto } from 'src/tips/dtos/tip-recipient.dto';

function keccak(bytes: any) {
  var h = keccak_256.create();
  h.update(bytes);
  var digest = h.digest();
  return digest;
}

export const makeIntegratedAddress = (
  primary_address_base58: string,
  payment_id_hex = '',
): { integratedAddress: string; paymentId: string } => {
  // Get public spend key, public view key from address
  var primary_address = base58xmr.decode(primary_address_base58);
  var network = primary_address.slice(0, 1);
  var public_spend_key = primary_address.slice(1, 33);
  var public_view_key = primary_address.slice(33, 65);
  var checksum = primary_address.slice(65, 69);
  if (payment_id_hex) {
    // Use provided payment ID
    var payment_id = hexToBytes(payment_id_hex);
  } else {
    // Generate 8-byte payment ID
    var payment_id = randomBytes(8);
  }
  // Encode integrated address
  var integrated_address = new Uint8Array(77);
  integrated_address[0] = 0x13;
  integrated_address.set(public_spend_key, 1);
  integrated_address.set(public_view_key, 33);
  integrated_address.set(payment_id, 65);
  var hash = keccak(integrated_address.slice(0, 73));
  var checksum = hash.slice(0, 4);
  integrated_address.set(checksum, 73);
  var integrated_address_base58 = base58xmr.encode(integrated_address);
  var payment_id_hex = bytesToHex(payment_id);
  return {
    integratedAddress: integrated_address_base58,
    paymentId: payment_id_hex,
  };
};

export interface MoneroUriRecipient {
  address: string;
  name?: string;
  amount: number;
}

export interface MoneroUriOptions {
  description?: string;
}

/**
 * Generates a Monero URI for multiple recipients according to the Monero URI specification
 * @param recipients Array of recipients with addresses, names, and amounts
 * @param options Optional parameters like description
 * @returns Formatted Monero URI string
 */
export const generateMoneroUri = (
  recipients: MoneroUriRecipient[],
  options: MoneroUriOptions = {},
): string => {
  if (!recipients || recipients.length === 0) {
    throw new Error('At least one recipient is required');
  }

  // Filter out recipients without addresses
  const validRecipients = recipients.filter((recipient) => recipient.address);

  if (validRecipients.length === 0) {
    throw new Error('At least one recipient with a valid address is required');
  }

  // Use the first recipient's address as the main address
  const mainAddress = validRecipients[0].address;
  const params: string[] = [];

  // Add tx_amount parameter (using the first recipient's amount or 1 as default)
  const txAmount = validRecipients[0].amount;
  params.push(`tx_amount=${txAmount}`);

  // Add additional recipients as address[1], amount[1], etc.
  validRecipients.forEach((recipient, index) => {
    if (index === 0) return;
    params.push(`address[${index}]=${encodeURIComponent(recipient.address)}`);
    params.push(`amount[${index}]=${recipient.amount}`);
  });

  if (options.description && options.description.length > 0) {
    params.push(`tx_description=${encodeURIComponent(options.description)}`);
  }

  // Build the base URI with addresses
  // const addresses = validRecipients
  //   .map((recipient) => recipient.address)
  //   .join(';');
  // let uri = `monero:${addresses}`;

  // // Add query parameters
  // const queryParams: string[] = [];

  // // Add recipient names if provided
  // const names = validRecipients
  //   .map((recipient) => recipient.name || '')
  //   .join(';');
  // if (names && names.split(';').some((name) => name.length > 0)) {
  //   queryParams.push(`recipient_name=${encodeURIComponent(names)}`);
  // }

  // // Add amounts if provided
  // const amounts = validRecipients
  //   .map((recipient) => recipient.amount?.toString() || '')
  //   .join(';');
  // if (amounts && amounts.split(';').some((amount) => amount.length > 0)) {
  //   queryParams.push(`tx_amount=${encodeURIComponent(amounts)}`);
  // }

  // // Add description if provided
  // if (options.description) {
  //   queryParams.push(
  //     `tx_description=${encodeURIComponent(options.description)}`,
  //   );
  // }

  // // Append query parameters if any exist
  // if (queryParams.length > 0) {
  //   uri += `?${queryParams.join('&')}`;
  // }

  return `monero:${mainAddress}?${params.join('&')}`;
};

export const generateMoneroUriFromTipRecipients = (
  tipRecipients: TipRecipientDto[],
): string => {
  const recipients: MoneroUriRecipient[] = tipRecipients.map((recipient) => ({
    address: recipient.address,
    amount: recipient.amount,
  }));

  return generateMoneroUri(recipients);
};
