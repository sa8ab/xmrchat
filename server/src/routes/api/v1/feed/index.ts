
import type {ElysiaApp} from '../../../../index';

import {buildResponseDocumentation} from '../../../../utils/buildResponseDocumentation';

import FeedService from '../../../../services/feeds';
import {GetTipFeedSchema, SearchFeedSchema} from '../../../../schemas/feeds';

const tags = ['pages'];
export default (app: ElysiaApp) => {
	return app
		.get('/', async () => await FeedService.GetFeed(), {
			...GetTipFeedSchema.payload,
			detail: {
				tags,
				summary: 'Get latest tip feed',
				responses: buildResponseDocumentation({
					200: GetTipFeedSchema.response,
				}),
			},
		})
		.get(
			'/search',
			async ({query}) => await FeedService.SearchFeed({...query}),
			{
				...SearchFeedSchema.payload,
				detail: {
					tags,
					summary: 'Search feed',
					responses: buildResponseDocumentation({
						200: SearchFeedSchema.response,
					}),
				},
			}
		);
};
