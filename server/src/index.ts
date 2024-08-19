import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { autoload } from 'elysia-autoload';
import { AppResponse } from './utils/appResponse';
import PageService from './services/pages';
import './env';
import { SessionValidationMiddleware } from './utils/auth';
import cors from '@elysiajs/cors';
import { notificationEmitter } from './events/notification.event';
import { moneroLWS } from './utils/monero';
import { db } from './db/connect';
import Twitch from './utils/twitch';

const app = new Elysia()
	.ws(
		'/ws/:id',
		{
			message(ws, message) {

				console.log('WebSocket Message received: ', message);
				ws.send(message)
			},
			async open(ws) {
				console.log('WebSocket connection openned on: ', ws.data);

				const id = ws.data.params.id;
				console.log('WebSocket connection openned on: ', id);

				if (id.slice(0, 5) == 'user-') {
					notificationEmitter.on('user:' + id.slice(5), (data) => {

						ws.send({ data })
					})
				}

				if (id.slice(0, 4) == 'tip-') {
					console.log('TIP- is connected to : ', 'tip:' + id.slice(4))
					notificationEmitter.on('tip:' + id.slice(4), (data) => {
						console.log({ wsSEND: data })
						ws.send({ data })
					});
					const existingTip = await db
						.selectFrom('tips')
						.selectAll()
						.where('id', '=', id.slice(4))
						.executeTakeFirst();
					ws.send({ data: { type: "TIP_OBJECT", tip: existingTip } })
				}

				// await PageService.GetTipPaidStatus(ws,id)
			},
			close(ws) {
				const id = ws.data.params.id;
				if (id.slice(0, 5) == 'user-') { notificationEmitter.removeAllListeners('user:' + id.slice(5)); }
				if (id.slice(0, 4) == 'tip-') { notificationEmitter.removeAllListeners('tip:' + id.slice(4)); }

				console.log('WebSocket connection closed on: ', id);
			},
			error(error) {

				console.error('WebSocket error:', error);

			},

		}

	)
	.use(SessionValidationMiddleware)

	.use(
		cors({
			origin: true,
			credentials: true,
			methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Sec-WebSocket-Protocol', 'Connection', 'Upgrade', 'Sec-WebSocket-Extensions'],
			maxAge: 86400,
			preflight: true,
		})
	)
	.use(
		autoload({
			types: true,
		})
	)
	.use(
		swagger({
			documentation: {
				openapi: '3.1.0',
				info: {
					title: `${process.env.APP_NAME} API Documentation`,
					description: `This is the API documentation for ${process.env.APP_NAME}.`,
					version: process.env['npm_package_version'] || '0.0.0',
				},
			},
		})
	)
	.error('AppResponse', AppResponse)
	.onError(({ code, error }) => {
		console.error(error);

		switch (code) {
			case 'AppResponse':
				return error.toJSON();
			default:
				return {
					error: 'Something went wrong. Please try again later.',
					details:
						process.env.NODE_ENV === 'development'
							? error
							: undefined,
				};
		}
	})
	.listen(
		{
			hostname: process.env.APP_HOST,
			port: process.env.APP_PORT,
		},
		async () => {
			console.log(
				`${process.env.APP_NAME} listening on ${process.env.APP_HOST}:${process.env.APP_PORT}`
			);

			const lws = new moneroLWS()
			const res = await lws.listAccounts()
			console.log('LWS CONNECTION TEST', res)

			try {
				await Twitch.tokenUpdatingSchedule()

			} catch (error) {
				console.log('ERROR at twich token updating scheduler:', error)
			}
		}
	);

export type ElysiaApp = typeof app;
export { app };
