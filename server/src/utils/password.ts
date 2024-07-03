
import { pbkdf2Sync } from 'crypto';

const PBKDF2_OUTPUT_LENGTH = 64;
const NIST_PBKDF2_SHA256_ITERATIONS = 1000;

/**
 * Hashes a password using PBKDF2 with NIST-recommended parameters.
 */
export const HashPassword = (password: string, salt: string) => {
	return pbkdf2Sync(
		password,
		salt,
		NIST_PBKDF2_SHA256_ITERATIONS,
		PBKDF2_OUTPUT_LENGTH,
		'sha256'
	).toString('hex');
};
