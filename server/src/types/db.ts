import type {ColumnType} from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Pages {
	adult: boolean;
	cover_image: string | null;
	creation: Generated<Timestamp>;
	description: string | null;
	id: Generated<string>;
	logo: string | null;
	name: string;
	path: string;
	payment_address: string;
	view_key: string;
	user_id: string;
	featured_tip: string | null;
}

export interface PageTiers {
	amount: string;
	creation: Generated<Timestamp>;
	description: string | null;
	id: Generated<string>;
	name: string;
	page_id: string;
}

export interface Tips {
	amount: string;
	creation: Generated<Timestamp>;
	id: Generated<string>;
	message: string;
	page_id: string;
	paid: Generated<boolean>;
	paid_at: Timestamp | null;
	payment_address: string;
	private: Generated<boolean>;
	name: string;
	tier_id: string | null;
	height: number;
}

export interface Users {
	creation: Generated<Timestamp>;
	email: string | null;
	id: Generated<string>;
	password: string;
	password_salt: string;
	username: string;
}

export interface DB {
	page_tiers: PageTiers;
	pages: Pages;
	tips: Tips;
	users: Users;
}
