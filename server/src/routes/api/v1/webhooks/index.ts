
import type { ElysiaApp } from '../../../../index';

import { buildResponseDocumentation } from '../../../../utils/buildResponseDocumentation';
// import { t } from 'elysia';
import { moneroLWS } from '../../../../utils/monero';


const tags = ['webhooks'];
export default (app: ElysiaApp) => {
	return app.post(
		'/:token',
		async ({ body, params }) => {
			if (params.token != "hiqkOA7aqLByc82XBPIqOJUMHSyivfmUVCWKoJm5XbuAr3QXrTzYJB4HJUED") {
				return { error: 'Unauthorized' };

			}
			console.log('EVENT COME IN POST', body)
			const lws = new moneroLWS()
			const response = await lws.eventHandler(body)
			console.log('webhook response route', { response })




			return {};

		},
		{
			detail: {
				tags,
				summary: 'monero LWS webhook handler',
				// responses: buildResponseDocumentation({
				// 	200: t.Object({}),
				// }),
			},
		}
	);
};

