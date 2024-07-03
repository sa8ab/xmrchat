
import { t } from 'elysia';

const token = t.String({
	examples: ['jkju2h23jnrjkbdh2b3'],
	description: 'The token to be verified something like email.',
});


const expires_at = t.String({
	format: 'date-time',
	examples: ['2021-01-01T00:00:00Z'],
	description: 'The time that the tip was paid.',
});



const type = t.String({
	examples: ['EMAIL_VERIFICATION'],
	description: 'The tyoe of the token (purpose).',
	default: 'EMAIL_VERIFICATION',
});

export { token, expires_at, type };
