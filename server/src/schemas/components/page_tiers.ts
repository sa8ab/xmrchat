
import {t} from 'elysia';

const tier_name = t.String({
	examples: ['my_tier'],
	description: 'The name of the tip tier.',
	minLength: 3,
	maxLength: 32,
});

const tier_description = t.String({
	examples: ['My tier description.'],
	description: 'The description of the tip tier.',
	minLength: 3,
	maxLength: 1024,
});

export {tier_name, tier_description};
