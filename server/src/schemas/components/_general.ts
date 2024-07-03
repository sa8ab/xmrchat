
import { t } from 'elysia';

const uuid = t.String({
	format: 'uuid',
	examples: ['f47ac10b-58cc-4372-a567-0e02b2c3d479'],
	description: 'A version 4 UUID.',
});

const payment_address = t.String({
	examples: [
		'888tNkZrPN6JsEgekjMnABU4TBzc2Dt29EPAvkRxbANsAnjyPbb3iQ1YBRk1UXcdRsiKc9dhwMVgN5S9cQUiyoogDavup3H',
	],
	description: 'A Monero payment address.',
	minLength: 95,
	maxLength: 106,
});

const view_key = t.String({
	examples: [
		'060ba31f1c3b165ae24e34291ccba1e6f8b6cc47f3fb2d5a88f12d7a8ce8e20f',
	],
	description: 'A Monero private/secret view key.',
	minLength: 64,
	maxLength: 64,
});

const amount = t.String({
	examples: ['1000'],
	description: 'The amount of the tip in atomic units (piconeros).',
	minLength: 1,
	maxLength: 32,
});

const creation = t.String({
	format: 'date-time',
	examples: ['2021-01-01T00:00:00Z'],
	description: 'The creation time of the object.',
});

const ids = {
	user_id: uuid,
	page_id: uuid,
	token_id: uuid,
	tier_id: uuid,
	tip_id: uuid,
	image_id: uuid,
};

export { uuid, payment_address, view_key, amount, creation, ids };
