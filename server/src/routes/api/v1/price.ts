
import type { ElysiaApp } from '../../..';

import TTLCache from '@isaacs/ttlcache';

import { buildResponseDocumentation } from '../../../utils/buildResponseDocumentation';
import { t } from 'elysia';

const priceCache = new TTLCache({ ttl: 60 * 1000 });

const tags = ['price'];
export default (app: ElysiaApp) => {
	return app.get(
		'/',
		async () => {
			const price = priceCache.get('price');
			if (price) {
				return { price };
			}


			const response = await fetch(
				'https://localmonero.co/web/ticker?currencyCode=USD'
			);

			const data = await response.json();
			const avg = data.USD?.avg_6h;

			priceCache.set('price', avg);
			if (!avg) {
				const response = await fetch(
					'https://min-api.cryptocompare.com/data/price?fsym=XMR&tsyms=USD'
				);

				const data = await response.json();
				const price = data.USD;

				priceCache.set('price', price);
				return { price: price };
			}
			return { price: avg };

		},
		{
			detail: {
				tags,
				summary: 'Get the current XMR/USD price',
				responses: buildResponseDocumentation({
					200: t.Object({ price: t.Number() }),
				}),
			},
		}
	);
};
