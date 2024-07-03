
export type ReservationData = {
	user_id: string;
	slug: string;
	index: number;
	amount: string;
	paid_amount: number;

	//name: string;
	//description: string;
	payment_address: string;
	view_key: string;
	logo?: string;
	cover_image?: string;
	adult: boolean;
	tiers?: Array<{
		name: string;
		price: string;
	}>;
};
