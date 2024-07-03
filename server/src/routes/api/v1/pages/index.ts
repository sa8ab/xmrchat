
import type { ElysiaApp } from '../../../../index';

import { buildResponseDocumentation } from '../../../../utils/buildResponseDocumentation';

import PageService from '../../../../services/pages';
import {
	GetPagesSchema,
	CheckSlugReservationSchema,
	CheckSlugSchema,
	ReserveSlugSchema,
} from '../../../../schemas/pages';
import { uploadImage } from '../../../../utils/uploadImage';

const tags = ['pages'];
export default (app: ElysiaApp) => {
	return app
		.get(
			'/',
			async ({ user }) => {
				if (!user) {
					return { error: 'Unauthorized' };
				}

				return await PageService.GetPages(user);
			},
			{
				...GetPagesSchema.payload,
				detail: {
					tags,
					summary: 'Get all pages for user',
					responses: buildResponseDocumentation({
						200: GetPagesSchema.response,
					}),
				},
			}
		)
		.get(
			'/checkslug',
			async ({ user, query, redirect }) => {
				if (!user) {
					return { error: 'Unauthorized' };
				}

				return await PageService.CheckSlug(user, { ...query });
			},
			{
				...CheckSlugSchema.payload,
				detail: {
					tags,
					summary: 'Check if a slug is available',
					responses: buildResponseDocumentation({
						200: CheckSlugSchema.response,
					}),
				},

			}
		)
		.post(
			'/reserveslug',
			async ({ body, user }) => {
				if (!user) {
					return { error: 'Unauthorized' };
				}
				body.slug = body.slug.toLowerCase();

				return await PageService.ReserveSlug(user, {
					...body,
				});
			},
			{
				...ReserveSlugSchema.payload,
				detail: {
					tags,
					summary: 'Reserve a slug',
					responses: buildResponseDocumentation({
						200: ReserveSlugSchema.response,
					}),
				},
			}
		)
		.get(
			'/checkreservation',
			async ({ query, user }) => {
				if (!user) {
					return { error: 'Unauthorized' };
				}
				return await PageService.CheckSlugReservation(user, {
					...query,
				});
			},
			{
				...CheckSlugReservationSchema.payload,
				detail: {
					tags,
					summary: 'Check if a slug is reserved',
					responses: buildResponseDocumentation({
						200: CheckSlugReservationSchema.response,
					}),
				},
			}
		);
};
