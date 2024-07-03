
import {t} from 'elysia';

const message = t.String({
	examples: ['My message.'],
	description: 'The message to be sent.',
	minLength: 3,
	maxLength: 1024,
});

const paid = t.Boolean({
	examples: [true],
	description: 'Whether the tip has been paid or not.',
});

const paid_at = t.String({
	format: 'date-time',
	examples: ['2021-01-01T00:00:00Z'],
	description: 'The time that the tip was paid.',
});

const tip_private = t.Boolean({
	examples: [true],
	description: 'Whether the tip is private or not.',
});

const tip_name = t.String({
	examples: ['Bob'],
	description: 'The name of the tipper.',
	minLength: 1,
	maxLength: 32,
	default: 'Anonymous',
});

export {message, paid, paid_at, tip_private, tip_name};
