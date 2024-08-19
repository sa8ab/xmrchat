/* eslint-disable node/no-unsupported-features/es-builtins */
import type { User } from 'lucia';

import { db } from '../db/connect';
import { createConnection } from '../utils/redis';
import { connectWalletRpc, getRpc, makeIntegratedAddress, moneroLWS } from '../utils/monero';
import type { ReservationData } from '../types/reservationData';
import type { Pages, Tips } from '../types/db';
import { MoneroNetworkType, MoneroUtils } from 'monero-ts';
import { page_description } from '../schemas/components/pages';
import schedule from 'node-schedule';
import { sql } from 'kysely';
import type { ElysiaWS } from 'elysia/ws';
/**
 * Retrieves information all pages.
 */
const GetPages = async (user: User) => {
	console.log(user.id)
	const pages = await db
		.selectFrom('pages')
		.where('user_id', '=', user.id)
		.selectAll()
		.execute();

	const pagesWithTires = await Promise.all(
		pages.map(async (page) => {
			const tiers = await db
				.selectFrom('page_tiers')
				.where('page_id', '=', page.id)
				.selectAll()
				.execute();

			// Attach tiers to the page object
			return {
				...page,
				tiers: tiers, // If no tiers, this will be an empty array
			};
		})
	);

	console.log(pagesWithTires);

	return pagesWithTires;
};
const SearchPages = async (path: string = '', limit: number = 10, offset: number = 0) => {

	let query = db.selectFrom('pages')
		.leftJoin('tips', 'pages.id', 'tips.page_id')
		.groupBy(['pages.id'])
		.select([
			'pages.id',
			'pages.cover_image',
			'pages.description',
			'pages.logo',
			'pages.name',
			'pages.path',
			'pages.featured_tip',
			'pages.twitch_channel',
			sql<number>`COALESCE(SUM(CAST(tips.paid_amount AS numeric)), 0)`.as('total_tipped')
		])
		.orderBy('total_tipped', 'desc')
		.limit(limit)
		.offset(offset);


	if (path) {
		query = query.where('path', 'like', `%${path}%`);
	}

	const result = await query.execute();
	const pages = result.map(({ total_tipped, ...page }: any) => page);

	return {
		pages,
	};
};
/**
 * Retrieves information about a specific page.
 */
const GetPage = async (user: User | null, payload: { path: string }) => {
	const page = await db
		.selectFrom('pages')
		.where('path', '=', payload.path)
		.selectAll()
		.executeTakeFirst();

	if (!page) {
		return { error: 'Page not found', status: 404 };
	}

	page.tiers = await db
		.selectFrom('page_tiers')
		.where('page_id', '=', page.id)
		.selectAll()
		.execute();

	// @ts-expect-error TODO (Incompatibility in Date types)
	const result: Partial<Pages> = page;
	if (page.user_id !== user?.id) {
		delete result.payment_address;
		delete result.view_key;
	}
	// const tiers = await db
	// 	.selectFrom('page_tiers')
	// 	.selectAll()
	// 	.where('page_id', '=', page.id)
	// 	.execute();

	// tiers.forEach(tier => {
	// 	tier.amount = MoneroUtils.atomicUnitsToXmr(tier.amount).toString();
	// });


	return { result };
};

/**
 * Checks if a slug is available.
 */
const CheckSlug = async (user: User, payload: { slug: string }) => {
	const page = await db
		.selectFrom('pages')
		.select('user_id')
		.where('path', '=', payload.slug)
		.executeTakeFirst();

	const redis = await createConnection();
	const redisExists = await redis.exists(`slug:${payload.slug}`);
	redis.disconnect();

	return {
		available: !page && !redisExists,
		owned: page?.user_id === user.id,
	};
};

/**
 * Updates a page.
 */
const UpdatePage = async (
	user: User,
	payload: {
		//name?: string;
		//description?: string;
		payment_address?: string;
		featured_tip?: string;
		twitch_channel?: string | null;
		view_key?: string;
		logo?: string;
		cover_image?: string;
		adult?: boolean;

		path: string;
		tiers?: Array<{
			name: string;
			price: string;
		}>;
	}
) => {
	if (payload.payment_address) {
		try {
			await MoneroUtils.validateAddress(
				payload.payment_address,
				MoneroNetworkType.MAINNET
			);
		} catch (e) {
			return { error: 'Invalid payment address' };
		}
	}

	console.log({ payload })

	const page = await db
		.selectFrom('pages')
		.select(['id', 'user_id', 'view_key', 'payment_address'])
		.where('path', '=', payload.path)
		.executeTakeFirst();

	if (!page) {
		return { error: 'Page not found', status: 404 };
	}

	if (page.user_id !== user.id) {
		return { error: 'Page not owned by user', status: 401 };
	}

	if ((payload.payment_address && payload.payment_address != page.payment_address) && (payload.view_key && payload.view_key != page.view_key)) {

		const view_key = payload.view_key || page.view_key;
		const monero_address = payload.payment_address || page.payment_address;
		const lws = new moneroLWS()

		try {
			await lws.addAccount({
				params: {
					address: monero_address,
					key: view_key
				}
			})

		} catch (e) {
			return {
				error: 'Invalid payment address or view key',
			};
		}
	} else if (payload.payment_address && payload.payment_address != page.payment_address) {


		const view_key = payload.view_key || page.view_key;
		// const monero = await getRpc();
		const lws = new moneroLWS()

		try {
			await lws.addAccount({
				params: {
					address: payload.payment_address,
					key: view_key
				}
			})
			// await monero.createWallet({
			// 	primaryAddress: payload.payment_address,
			// 	privateViewKey: view_key,
			// });
		} catch (e) {
			return {
				error: 'Invalid payment address or view key',
			};
		}

		// monero.close();
	} else if (payload.view_key && payload.view_key != page.view_key) {
		const monero_address = payload.payment_address || page.payment_address;
		// const monero = await getRpc();
		const lws = new moneroLWS()

		try {
			await lws.addAccount({
				params: {
					address: monero_address,
					key: payload.view_key
				}
			})

			// await monero.createWallet({
			// 	primaryAddress: monero_address,
			// 	privateViewKey: payload.view_key,
			// });
		} catch (e) {
			return {
				error: 'Invalid payment address or view key',
			};
		}

		// monero.close();
	}

	payload.cover_image = payload.cover_image === '' ? undefined : payload.cover_image;
	payload.logo = payload.logo === '' ? undefined : payload.logo;

	const update = await db
		.updateTable('pages')
		.set({
			//name: payload.name,
			//description: payload.description,
			payment_address: payload.payment_address,
			featured_tip: payload.featured_tip,
			twitch_channel: !!payload.twitch_channel ? payload.twitch_channel : null,
			view_key: payload.view_key,
			logo: payload.logo,
			cover_image: payload.cover_image,
			adult: payload.adult,
		})
		.where('path', '=', payload.path)
		.returning('id')
		.execute();

	if (!update) {
		return { error: 'Something went wrong', status: 500 };
	}

	if (payload.tiers) {



		for (const tier of payload.tiers) {
			const valid = MoneroUtils.xmrToAtomicUnits(tier.price);
			// eslint-disable-next-line node/no-unsupported-features/es-builtins
			if (valid === BigInt('0')) {
				return { error: 'Invalid tier price' };
			}
		}

		await db
			.deleteFrom('page_tiers')
			.where('page_id', '=', page.id)
			.execute();

		if (payload.tiers.length != 0)
			await db
				.insertInto('page_tiers')
				.values([
					...payload.tiers.map(tier => ({
						page_id: page.id,
						name: tier.name,
						amount: tier.price
					})),
				])
				.execute();
	}

	return update;
};

/**
 * Tips a page.
 */
const TipPage = async (payload: {
	path: string;
	amount: string;
	name: string;
	message?: string;
	private: boolean;
}) => {
	console.log(payload.amount, typeof payload.amount)
	console.log(process.env.MIN_TIP_AMOUNT, typeof process.env.MIN_TIP_AMOUNT)

	// eslint-disable-next-line node/no-unsupported-features/es-builtins
	if (BigInt(payload.amount) < BigInt(process.env.MIN_TIP_AMOUNT)) {

		return {
			error: `Amount too low. In order to prevent spam, the minimum tip amount is ${MoneroUtils.atomicUnitsToXmr(
				process.env.MIN_TIP_AMOUNT
			).toString()} XMR.`,
			status: 400,
		};
	}

	const page = await db
		.selectFrom('pages')
		.select(['payment_address', 'view_key', 'id'])
		.where('path', '=', payload.path)
		.executeTakeFirst();

	if (!page) {
		return { error: 'Page not found', status: 404 };
	}

	// const monero = await getRpc();
	// let wallet;
	const address = makeIntegratedAddress(page.payment_address)
	const lws = new moneroLWS()
	// TODO: FIX THIS ON WEBHOOK 
	try {
		// wallet = await monero.createWallet({
		// 	primaryAddress: page.payment_address,
		// 	privateViewKey: page.view_key,
		// });
		const craetedAccount = await lws.addAccount({
			params: {
				address: page.payment_address,
				key: page.view_key,
			}
		})
		console.log('craetedWebhook', craetedAccount)
	} catch (e) {
		console.log("error", e)
	}
	// const height = await monero.getHeight()
	let event_id = ""
	try {
		// wallet = await monero.createWallet({
		// 	primaryAddress: page.payment_address,
		// 	privateViewKey: page.view_key,
		// });
		const craetedWebhook = await lws.addWebhook({
			params: {
				type: "tx-confirmation",
				address: page.payment_address,
				payment_id: address.paymentId,
			}
		})
		event_id = craetedWebhook.event_id
		console.log('craetedWebhook', craetedWebhook)
	} catch (e) {
		console.log(e)
		return {
			error: 'This page has not set up tipping. Please try again later.',
		};
	}
	console.log('sync')


	// const address = await wallet.getIntegratedAddress();

	console.log('address end1,', address)

	// await wallet.close();
	console.log('address end2')
	// const height = await wallet.getHeight()
	// await monero.close();
	console.log('address end3')

	const tip = await db
		.insertInto('tips')
		.values({
			page_id: page.id,
			amount: payload.amount,
			name: payload.name,
			message: payload.message,
			private: payload.private,
			payment_address: address.integratedAddress,
			payment_id: address.paymentId,
			height: process.env.WALLET_HEIGHT, // start syncing from this height
			// height: height,
			event_id,
			paid: false,
		})
		.returning('id')
		.executeTakeFirst();

	if (!tip) {
		return { error: 'Something went wrong', status: 500 };
	}
	console.log("id: tip.id", { id: tip.id, })

	return {
		payment_address: address.integratedAddress,
		amount: MoneroUtils.atomicUnitsToXmr(payload.amount).toString(),
		id: tip.id,
	};
};

/**
 * Checks if a tip has been paid.
 */
// const CheckTip = async (payload: { id: string }) => {


// 	console.log(payload.id)
// 	const tip = await db
// 		.selectFrom('tips')
// 		.select([
// 			'paid',
// 			'paid_at',
// 			'payment_address',
// 			'page_id',
// 			'amount',
// 			'height',
// 		])
// 		.where('id', '=', payload.id)
// 		.executeTakeFirst();

// 	if (!tip) {
// 		return { error: 'Tip not found', status: 404 };
// 	}

// 	if (tip.paid) {
// 		return {
// 			paid: true,
// 			paid_at: tip.paid_at,
// 		};
// 	}

// 	const page = await db
// 		.selectFrom('pages')
// 		.select(['view_key', 'payment_address'])
// 		.where('id', '=', tip.page_id)
// 		.executeTakeFirst();

// 	if (!page) {
// 		return { error: 'Page not found', status: 404 };
// 	}

// 	const monero = await getRpc();
// 	let wallet;
// 	let paid;
// 	let paid_at
// 	try {

// 		wallet = await monero.createWallet({
// 			primaryAddress: page.payment_address,
// 			privateViewKey: page.view_key,
// 			restoreHeight: tip.height,

// 		});
// 		await wallet.startSyncing(0);


// 		// Wait five seconds for the wallet to sync.
// 		// This is not the best way to do this.
// 		await new Promise(resolve => {
// 			setTimeout(() => {
// 				resolve(false);
// 			}, 30000);
// 		});

// 		const balance1 = await wallet.getBalance();
// 		console.log('balance1', balance1)
// 		const height = await wallet.getHeight()
// 		console.log('height', height)

// 		const transactions = await wallet.getIncomingTransfers({
// 			// address: tip.payment_address
// 		})
// 		console.log(transactions)
// 		const balance = transactions.reduce((acc, transaction) => {
// 			console.log(acc, transaction)
// 			return acc + transaction.amount
// 		}, BigInt(0))

// 		paid = balance >= BigInt(tip.amount);
// 		paid_at = paid ? new Date() : null;

// 		if (paid) {
// 			await db
// 				.updateTable('tips')
// 				.set({
// 					paid,
// 					paid_at,
// 				})
// 				.where('id', '=', payload.id)
// 				.execute();
// 		}


// 	} catch (error) {
// 		return {
// 			error: 'This page has not set up tipping. Please try again later.',
// 		};

// 	} finally {
// 		await wallet.close();

// 	}
// 	return {
// 		paid,
// 		paid_at,
// 	};
// };

/**
 * Checks if a tip has been paid just from database.
 */
const GetTipPaidStatus = async (ws: ElysiaWS<any>, tipId: string) => {

	try {

		console.log(tipId)
		const tip = await db
			.selectFrom('tips')
			.select([
				'paid',
				'paid_at',
				'payment_address',
				'page_id',
				'amount',
				'height',
			])
			.where('id', '=', tipId)
			.executeTakeFirst();

		if (!tip) {
			ws.send({ error: 'Tip not found', status: 404 });
			ws.close();
			return
		}
		console.log('tip', tip, !tip)

		if (tip.paid) {
			ws.send({
				paid: true,
				paid_at: tip.paid_at,
			});
			ws.close()
			return
		}

		const page = await db
			.selectFrom('pages')
			.select(['view_key', 'payment_address'])
			.where('id', '=', tip.page_id)
			.executeTakeFirst();

		console.log('page', page, !page)
		if (!page) {
			ws.send({ error: 'Page not found', status: 404 });

		}




		const updatePaidStatus = async (ws: ElysiaWS<any>, tip, page, startDate = new Date()) => {

			let response;
			let wallet;
			let paid;
			let paid_at

			// const monero = await getRpc();
			try {


				// wallet = await monero.createWallet({
				// 	primaryAddress: page.payment_address,
				// 	privateViewKey: page.view_key,
				// 	restoreHeight: tip.height,
				// });
				// await wallet.startSyncing(0);


				// Wait five seconds for the wallet to sync.
				// This is not the best way to do this.
				// await new Promise(resolve => {
				// 	setTimeout(() => {
				// 		resolve(false);
				// 	}, 10000);
				// });

				// const balance = await wallet.getBalance();

				// const transactions = await wallet.getIncomingTransfers({
				// 	address: tip.payment_address
				// })
				// const balance = transactions.reduce((acc, transaction) => {
				// 	return acc + transaction.amount
				// }, BigInt(0))

				// paid = balance >= BigInt(tip.amount);
				// paid_at = paid ? new Date() : null;

				// if(paid){}
				// await db
				// 	.updateTable('tips')
				// 	.set({
				// 		paid,
				// 		paid_at,
				// 	})
				// 	.where('id', '=', tipId)
				// 	.execute();
				// }
				tip = await db
					.selectFrom('tips')
					.select([
						'paid',
						'paid_at',
						'payment_address',
						'page_id',
						'amount',
						'height',
					])
					.where('id', '=', tip.id)
					.executeTakeFirst();


				console.log('run cron')
			} catch (error) {
				// ws.send({
				// 	error: 'This page has not set up tipping. Please try again later.',
				// });
				response = {
					error: 'This page has not set up tipping. Please try again later.',
				}

				// return {
				// 	error: 'This page has not set up tipping. Please try again later.',
				// };
				console.log('error cron')

			} finally {
				console.log('finally')
				// await wallet.close();

				// await wallet.close();
				// await monero.close()

			}


			response = {
				...tip
			}
			// console.log(ws, ws.CLOSED, ws.readyState)
			if (!paid && (startDate.getTime() + (6 * 100000)) > (new Date()).getTime()) schedule.scheduleJob(new Date(Date.now() + 60000), updatePaidStatus.bind(null, ws, tip, page, startDate));
			// 434a78cf-b899-4ec2-b768-e614b4f244e1
			// 
			console.log('cron response', response)
			if (ws.raw.readyState == 1) ws.send(response)

		}

		// schedule.scheduleJob(new Date(Date.now() + 3 * 60000),updatePaidStatus.bind(null, ws, tip, page, monero) );
		await updatePaidStatus(ws, tip, page);
		// await monero.close();

	} catch (error) {


		ws.send({ error })
		console.log(error)
	}



};

/**
 * Retrieves tips for a page.
 */
const GetTips = async (user: User | null, payload: { path: string }) => {
	const page = await db
		.selectFrom('pages')
		.select(['user_id', 'id'])
		.where('path', '=', payload.path)
		.executeTakeFirst();

	if (!page) {
		return { error: 'Page not found', status: 404 };
	}

	let tips = await db
		.selectFrom('tips')
		.selectAll()
		.where('page_id', '=', page.id)
		.where('paid', '=', true)
		.orderBy('creation', 'desc')
		.execute();

	if (page.user_id !== user?.id) {
		// @ts-expect-error TODO (Incompatibility in Date types)
		tips = tips.map((tip: Partial<Tips>) => {
			delete tip.payment_address;
			return tip;
		});

		tips = tips.filter(tip => !tip.private);
	}

	tips.forEach(
		tip =>
			(tip.amount = MoneroUtils.atomicUnitsToXmr(tip.amount).toString())
	);

	return tips;
};

/**
 * Reserves a slug.
 */
const ReserveSlug = async (
	user: User,
	payload: {
		slug: string;

		//name: string;
		//description: string;
		twitch_channel?: string;
		payment_address: string;
		view_key: string;
		logo?: string;
		cover_image?: string;
		adult: boolean;
		tiers?: Array<{
			name: string;
			price: string;
		}>;
	}
) => {
	const reserved = await CheckSlug(user, payload);
	if (!reserved.available) {
		if (reserved.owned) {
			return { error: 'Slug already owned' };
		} else {
			return { error: 'Slug not available' };
		}
	}

	await MoneroUtils.validateAddress(
		payload.payment_address,
		MoneroNetworkType.MAINNET
	).catch(() => {
		throw new Error('Invalid payment address');
	});

	const reservationTimestamp =
		new Date(
			Date.now() + 60 * 60 * 1000
		).getTime() / 1000;

	// const monero = await connectWalletRpc();
	// const paymentAddress = await monero.createSubaddress(
	// 	process.env.WALLET_ACCOUNT,
	// 	`slug:${payload.slug}`
	// );

	const integratedAddress = makeIntegratedAddress("466P1SSsfL3cTX4T2jN2ueDt5RWxPw34F522xSCxusKJFQEvXpvgmckWSMsuPHJ7AvDtt6V2VF4UE3MjoZs5UCMBPWqKBZp")

	console.log('const lws = new moneroLWS()')

	const lws = new moneroLWS()
	console.log('const lws = new moneroLWS()')


	try {
		await lws.addAccount({
			params: {
				address: '466P1SSsfL3cTX4T2jN2ueDt5RWxPw34F522xSCxusKJFQEvXpvgmckWSMsuPHJ7AvDtt6V2VF4UE3MjoZs5UCMBPWqKBZp',
				key: 'a2f066f06f99bb5a0eee88b641683a258fd22b69a4cb075ea431f6aa2f40330c'
			}
		})
	} catch (error) {
		console.log('err acccc', error.response, error.message)
	}

	console.log('BEFORE WEBHOOK')
	await lws.addWebhook({
		params: {
			address: '466P1SSsfL3cTX4T2jN2ueDt5RWxPw34F522xSCxusKJFQEvXpvgmckWSMsuPHJ7AvDtt6V2VF4UE3MjoZs5UCMBPWqKBZp',
			payment_id: integratedAddress.paymentId,
			token: 'streamer-' + payload.slug,
			type: "tx-confirmation",
		}
	})


	const data: ReservationData = {
		user_id: user.id,
		slug: payload.slug,
		index: 123,
		amount: process.env.SLUG_RESERVE_AMOUNT,
		tiers: payload.tiers,
		paid_amount: 0,
		//name: payload.name,
		twitch_channel: payload.twitch_channel,
		//description: payload.description,
		payment_address: payload.payment_address,
		view_key: payload.view_key,
		logo: payload.logo,
		cover_image: payload.cover_image,
		adult: payload.adult,
	};


	const redis = await createConnection();
	await redis.set(`slug:${payload.slug}`, JSON.stringify(data), {
		EX: 60 * 60,
	});
	redis.disconnect();

	return {
		payment_address: integratedAddress.integratedAddress,
		amount: MoneroUtils.atomicUnitsToXmr(
			process.env.SLUG_RESERVE_AMOUNT
		).toString(),
		reservation_timestamp: reservationTimestamp,
	};
};

/**
 * Checks if the payment has been received for a slug reservation.
 */
const CheckSlugReservation = async (
	user: User,
	payload: {
		slug: string;
	}
) => {
	const redis = await createConnection();
	const reservation = await redis.get(`slug:${payload.slug}`);
	redis.disconnect();

	if (!reservation) {
		return { error: 'Slug not reserved' };
	}

	const reservationData: ReservationData = JSON.parse(reservation);
	if (reservationData.user_id !== user.id) {
		return { error: 'Unauthorized' };
	}

	// const monero = await connectWalletRpc();
	// const balance = await monero.getBalance(
	// 	process.env.WALLET_ACCOUNT,
	// 	reservationData.index
	// );


	// eslint-disable-next-line node/no-unsupported-features/es-builtins
	// const paid = balance >= BigInt(reservationData.amount);

	// if (paid) {
	// 	//TODO atomicity
	// 	const redis = await createConnection();
	// 	await redis.del(`slug:${payload.slug}`);
	// 	redis.disconnect();

	// 	const tiers = reservationData.tiers
	// 	delete reservationData.tiers;
	// 	const id = await db
	// 		.insertInto('pages')
	// 		.values({
	// 			name: '',
	// 			path: payload.slug,
	// 			//description: reservationData.description,
	// 			adult: reservationData.adult,
	// 			payment_address: reservationData.payment_address,
	// 			user_id: user.id,
	// 			logo: reservationData.logo,
	// 			cover_image: reservationData.cover_image,
	// 			view_key: reservationData.view_key,
	// 		})
	// 		.returning('id')
	// 		.execute();

	// 	if (tiers && tiers.length != 0) {
	// 		await db
	// 			.insertInto('page_tiers')
	// 			.values(tiers.map(tier => ({
	// 				name: tier.name,
	// 				page_id: id,
	// 				amount: tier.price

	// 			})))
	// 			.execute();


	// 	}

	// 	return {
	// 		paid,
	// 		page_id: id,
	// 	};
	// }

	// return {
	// 	paid,
	// };
};

/**
 * Retrieve tip tiers for a page.
 */
const GetTiers = async (payload: { path: string }) => {
	const page = await db
		.selectFrom('pages')
		.select(['id'])
		.where('path', '=', payload.path)
		.executeTakeFirst();

	if (!page) {
		return { error: 'Page not found', status: 404 };
	}

	const tiers = await db
		.selectFrom('page_tiers')
		.selectAll()
		.where('page_id', '=', page.id)
		.execute();

	tiers.forEach(tier => {
		tier.amount = MoneroUtils.atomicUnitsToXmr(tier.amount).toString();
	});

	return { tiers };
};

/**
 * Create a tip tier for a page.
 */
const CreateTier = async (
	user: User,
	payload: {
		path: string;
		name: string;
		amount: string;
	}
) => {
	const amount = MoneroUtils.xmrToAtomicUnits(payload.amount).toString();

	// eslint-disable-next-line node/no-unsupported-features/es-builtins
	if (BigInt(amount) < BigInt(process.env.MIN_TIP_AMOUNT)) {
		return {
			error: `Amount too low. In order to prevent spam, the minimum tip amount is ${MoneroUtils.atomicUnitsToXmr(
				process.env.MIN_TIP_AMOUNT
			).toString()} XMR.`,
			status: 400,
		};
	}

	const page = await db
		.selectFrom('pages')
		.select(['id', 'user_id'])
		.where('path', '=', payload.path)
		.executeTakeFirst();

	if (!page) {
		return { error: 'Page not found', status: 404 };
	}

	if (page.user_id !== user.id) {
		return { error: 'Page not owned by user', status: 401 };
	}

	const res = await db
		.insertInto('page_tiers')
		.values({
			page_id: page.id,
			name: payload.name,
			amount,
		})
		.returning('id')
		.executeTakeFirst();

	if (!res) {
		return { error: 'Something went wrong.', status: 500 };
	}

	return {
		id: res.id,
	};
};



export default {
	GetPages,
	GetPage,
	UpdatePage,
	TipPage,
	SearchPages,
	// CheckTip,
	GetTips,
	GetTipPaidStatus,
	CheckSlug,
	ReserveSlug,
	CheckSlugReservation,
	GetTiers,
	CreateTier,
};
