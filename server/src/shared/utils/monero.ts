import { base58xmr } from '@scure/base';
import { keccak_256 } from '@noble/hashes/sha3';
import { bytesToHex, randomBytes, hexToBytes } from '@noble/hashes/utils';

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
