
import { t } from 'elysia';
import {
	amount,
	creation,
	ids,
	payment_address,
	view_key,
} from './components/_general';
import { page_description, page_name, page_path } from './components/pages';
import { tier_description, tier_name } from './components/page_tiers';
import { message, paid, paid_at, tip_private, tip_name } from './components/tips';
import { email, password, username, is_email_verified } from './components/users';
import { expires_at, token, type } from './components/user_tokens';

export const UserObject = t.Object({
	id: ids.user_id,
	username,
	password,
	email,
	creation,
	is_email_verified,
});

export const UserTokenObject = t.Object({
	id: ids.token_id,
	user_id: ids.user_id,
	token,
	type,
	expires_at,
	creation,
});


export const PageTierObject = t.Object({
	id: ids.tier_id,
	page_id: ids.page_id,
	name: tier_name,
	description: tier_description,
	amount,
	creation,
});

export const TipObject = t.Object({
	id: ids.tip_id,
	page_id: ids.page_id,
	tier_id: t.Optional(ids.tier_id),
	amount,
	name: tip_name,
	message,
	private: tip_private,
	payment_address,
	paid,
	paid_at: t.Optional(paid_at),
	creation,
});

export const PageObject = t.Object({
	id: ids.page_id,
	user_id: ids.user_id,
	name: page_name,
	path: page_path,
	description: page_description,
	payment_address,
	paid_amount: amount,
	view_key,
	logo: t.Optional(ids.image_id),
	cover_image: t.Optional(ids.image_id),
	featured_tip: t.Optional(ids.tip_id),
	adult: t.Boolean(),
	creation,
	tiers: t.Optional(t.Array(PageTierObject))
});
