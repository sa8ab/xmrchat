
import { t } from 'elysia';
import { PageObject, TipObject } from './_objects';
import {
	adult,
	page_description,
	page_name,
	page_path,
} from './components/pages';
import { ids, payment_address, amount, view_key } from './components/_general';
import { message, tip_name, tip_private } from './components/tips';
import { tier_name } from './components/page_tiers';

export const GetPagesSchema = {
	payload: {},
	response: t.Array(PageObject),
};

export const GetPageSchema = {
	payload: {
		params: t.Object({
			path: page_path,
		}),
	},
	response: PageObject,
};

export const UpdatePageSchema = {
	payload: {
		body: t.Object({
			//name: t.Optional(page_name),
			//description: t.Optional(page_description),
			payment_address: t.Optional(payment_address),
			featured_tip: t.Optional(ids.tip_id),
			view_key: t.Optional(view_key),
			logo: t.Optional(t.String()),
			cover_image: t.Optional(t.String()),
			adult: t.Optional(adult),
			tiers: t.Optional(
				t.Array(
					t.Object({
						name: tier_name,
						price: t.String({
							description: 'The price of the tier in USD.',
						}),
					})
				)
			),
		}),
		params: t.Object({
			path: page_path,
		}),
	},
	response: t.Object({ id: ids.page_id }),
};

export const CheckSlugSchema = {
	payload: {
		query: t.Object({
			slug: page_path,
		}),
	},
	response: t.Object({
		available: t.Boolean({ description: 'Whether the slug is available.' }),
		page_id: t.Optional(ids.page_id),
	}),
};

export const ReserveSlugSchema = {
	payload: {
		body: t.Object({
			slug: page_path,

			//name: page_name,
			//description: page_description,
			payment_address,
			view_key,
			logo: t.Optional(t.String()),
			cover_image: t.Optional(t.String()),
			adult,
			tiers: t.Optional(
				t.Array(
					t.Object({
						name: tier_name,
						price: t.String({
							description: 'The price of the tier in USD.',
						}),
					})
				)
			),
		}),
	},
	response: t.Object({
		payment_address,
		amount,
	}),
};

export const CheckSlugReservationSchema = {
	payload: {
		query: t.Object({
			slug: page_path,
		}),
	},
	response: t.Object({
		paid: t.Boolean(),
		page_id: t.Optional(ids.page_id),
	}),
};

export const TipPageSchema = {
	payload: {
		body: t.Object({
			name: tip_name,
			amount,
			message,
			private: tip_private,
		}),
		params: t.Object({
			path: page_path,
		}),
	},
	response: t.Object({
		payment_address,
		amount,
	}),
};

export const GetTipsSchema = {
	payload: {
		params: t.Object({
			path: page_path,
		}),
	},
	response: t.Array(TipObject),
};

export const CreateTierSchema = {
	payload: {
		body: t.Object({
			name: tier_name,
			amount,
		}),
		params: t.Object({
			path: page_path,
		}),
	},
	response: t.Object({ id: ids.tier_id }),
};

export const CheckTipSchema = {
	payload: {
		params: t.Object({
			path: page_path,
			id: ids.tip_id,
		}),
	},
	response: t.Object({
		paid: t.Boolean(),
		paid_at: t.Nullable(t.String()),
	}),
};
