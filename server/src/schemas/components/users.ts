
import { t } from 'elysia';

const username = t.String({
	examples: ['admin'],
	description: 'The username of the account.',
	minLength: 3,
	maxLength: 32,
});

const password = t.String({
	examples: ['password'],
	description: 'The password of the account.',
	minLength: 8,
	maxLength: 256,
});

const email = t.String({
	format: 'email',
	examples: ['name@example.com'],
	description: 'The email of the account.',
});
const is_email_verified = t.Boolean({
	examples: [false],
	description: 'Whether the user\'s email is verified or not.',
});


export { username, password, email, is_email_verified };
