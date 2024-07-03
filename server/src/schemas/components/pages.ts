
import {t} from 'elysia';

const page_name = t.String({
	examples: ['my_page'],
	description: 'The name of the page.',
	minLength: 3,
	maxLength: 64,
});

const page_path = t.String({
	examples: ['my_page'],
	description: 'The path that the page will be accessible from.',
	minLength: 3,
	maxLength: 16,
	pattern: '^[a-z0-9_-]+$',
	default: 'my_page',
});

const page_description = t.String({
	examples: ['My page description.'],
	description: 'The description of the page.',
	minLength: 3,
	maxLength: 4096,
});

const adult = t.Boolean({
	examples: [true],
	description: 'Whether the page contains adult content or not.',
});

export {page_name, page_path, page_description, adult};
