
import type { ElysiaApp } from '../../../../index';

import { buildResponseDocumentation } from '../../../../utils/buildResponseDocumentation';

import PageService from '../../../../services/pages';
import {
	GetPageSchema,
	UpdatePageSchema,
	TipPageSchema,
	GetTipsSchema,
	CreateTierSchema,
	CheckTipSchema,
} from '../../../../schemas/pages';

const tags = ['pages'];
export default (app: ElysiaApp) => {
	return app
		.get(
			'/',
			async ({ user, params }) =>
				await PageService.GetPage(user, { ...params }),
			{
				...GetPageSchema.payload,
				detail: {
					tags,
					summary: 'Retrieve a page',
					responses: buildResponseDocumentation({
						200: GetPageSchema.response,
					}),
				},
			}
		)
		.patch(
			'/',
			async ({ user, params, body }) => {
				if (!user) {
					return { error: 'Unauthorized', status: 401 };
				}

				return await PageService.UpdatePage(user, {
					...params,
					...body,
				});
			},
			{
				...UpdatePageSchema.payload,
				detail: {
					tags,
					summary: 'Update a page',
					responses: buildResponseDocumentation({
						200: UpdatePageSchema.response,
					}),
				},
			}
		)
		.post(
			'/tips',
			async ({ body, params }) =>
				await PageService.TipPage({ ...params, ...body }),
			{
				...TipPageSchema.payload,
				detail: {
					tags,
					summary: 'Tip a page',
					responses: buildResponseDocumentation({
						200: TipPageSchema.response,
					}),
				},
			}
		)
		.get(
			'/tips/:id',
			async ({ params }) => ({ sucess: true }),
			{
				...CheckTipSchema.payload,
				detail: {
					tags,
					summary: 'Check if a user has tipped a page',
					responses: buildResponseDocumentation({
						200: { sucess: true },
					}),
				},
			}
		)
		.ws(
			'/ws/tips/:id',
			{
				message(ws, message) {

					ws.send(message)
				},
				async open(ws) {
					const id = ws.data.params.id;
					console.log('WebSocket connection openned on: ', id);

					await PageService.GetTipPaidStatus(ws, id)
				},
				close(ws) {
					const id = ws.data.params.id;

					console.log('WebSocket connection closed on: ', id);
				},
				error(ws, error) {
					console.error('WebSocket error:', error);
				},

			}

		)
		.get(
			'/tips',
			async ({ user, params }) =>
				await PageService.GetTips(user, { ...params }),
			{
				...GetTipsSchema.payload,
				detail: {
					tags,
					summary: 'Retrieve tips for a page',
					responses: buildResponseDocumentation({
						200: GetTipsSchema.response,
					}),
				},
			}
		)
		.get(
			'/tiers',
			async ({ params }) => await PageService.GetTiers({ ...params }),
			{
				...GetTipsSchema.payload,
				detail: {
					tags,
					summary: 'Retrieve tip tiers for a page',
					responses: buildResponseDocumentation({
						200: GetTipsSchema.response,
					}),
				},
			}
		)
		.post(
			'/tiers',
			async ({ user, params, body }) => {
				if (!user) {
					return { error: 'Unauthorized', status: 401 };
				}

				return await PageService.CreateTier(user, {
					...params,
					...body,
				});
			},
			{
				...CreateTierSchema.payload,
				detail: {
					tags,
					summary: 'Create a tip tier for a page',
					responses: buildResponseDocumentation({
						200: CreateTierSchema.response,
					}),
				},
			}
		);
};
