
import {t} from 'elysia';
import {PageObject, TipObject} from './_objects';

export const GetTipFeedSchema = {payload: {}, response: t.Array(TipObject)};

export const SearchFeedSchema = {
	payload: {
		query: t.Object({
			query: t.String(),
		}),
	},
	response: t.Array(PageObject),
};
