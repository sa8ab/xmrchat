
import {db} from '../db/connect';
import type {Pages} from '../types/db';

/**
 * Retrieves the latest tip feed.
 */
const GetFeed = async () => {
	const tips = await db
		.selectFrom('tips')
		.selectAll()
		.where('paid', '=', true)
		.orderBy('creation', 'desc')
		.limit(process.env.FEED_LIMIT)
		.execute();

	return tips;
};

/**
 * Searches the feed.
 */
const SearchFeed = async (payload: {query: string}) => {
	const pages = await db
		.selectFrom('pages')
		.selectAll()
		.where('name', 'like', `%${payload.query}%`)
		.execute();

	// @ts-expect-error TODO (Incompatibility in Date types)
	return pages.map((page: Partial<Pages>) => {
		delete page.payment_address;
		delete page.view_key;
		return page;
	});
};

export default {
	GetFeed,
	SearchFeed,
};
