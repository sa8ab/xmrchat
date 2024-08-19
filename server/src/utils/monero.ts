import moneroTs, { MoneroUtils } from 'monero-ts';
import { base58xmr } from "@scure/base";
import { keccak_256 } from "@noble/hashes/sha3";
import { bytesToHex, randomBytes, hexToBytes } from "@noble/hashes/utils";
import axios from 'axios';
import { db } from '../db/connect';
import { createConnection } from '../utils/redis';
import type { ReservationData } from '../types/reservationData';
import { notificationEmitter } from '../events/notification.event';
import Twitch from './twitch';
import TTLCache from '@isaacs/ttlcache';
import { sendReportEmail } from './mailer';
const priceCache = new TTLCache({ ttl: 60 * 1000 });


/**
 * Connects to the Monero wallet RPC.
 */
export const getRpc = async () => {
	const monero = await moneroTs.connectToWalletRpc(
		`${process.env.WALLET_RPC_HOST}:${process.env.WALLET_RPC_PORT}`,
		process.env.WALLET_RPC_USER,
		process.env.WALLET_RPC_PASSWORD
	);

	return monero;
};

/**
 * Connects to the Monero wallet RPC and opens the server wallet.
 */
export const connectWalletRpc = async () => {
	const monero = await moneroTs.connectToWalletRpc(
		`${process.env.WALLET_RPC_HOST}:${process.env.WALLET_RPC_PORT}`,
		process.env.WALLET_RPC_USER,
		process.env.WALLET_RPC_PASSWORD
	);
	const wallet = await monero.openWallet(
		process.env.WALLET_NAME,
		process.env.WALLET_PASSWORD
	);

	return wallet;
};


export const getMoneroToUSDPrice = async () => {
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

}


function keccak(bytes: any) {
	var h = keccak_256.create();
	h.update(bytes);
	var digest = h.digest();
	return digest;
}


export const makeIntegratedAddress = (primary_address_base58: string, payment_id_hex = ''): { integratedAddress: string, paymentId: string } => {
	// Get public spend key, public view key from address
	var primary_address = base58xmr.decode(primary_address_base58);
	var network = primary_address.slice(0, 1);
	var public_spend_key = primary_address.slice(1, 33);
	var public_view_key = primary_address.slice(33, 65);
	var checksum = primary_address.slice(65, 69);
	if (payment_id_hex) {
		// Use provided payment ID
		var payment_id = hexToBytes(payment_id_hex);
	} else {
		// Generate 8-byte payment ID
		var payment_id = randomBytes(8);
	}
	// Encode integrated address
	var integrated_address = new Uint8Array(77);
	integrated_address[0] = 0x13;
	integrated_address.set(public_spend_key, 1);
	integrated_address.set(public_view_key, 33);
	integrated_address.set(payment_id, 65);
	var hash = keccak(integrated_address.slice(0, 73));
	var checksum = hash.slice(0, 4);
	integrated_address.set(checksum, 73);
	var integrated_address_base58 = base58xmr.encode(integrated_address);
	var payment_id_hex = bytesToHex(payment_id);
	return { integratedAddress: integrated_address_base58, paymentId: payment_id_hex };
}

interface Id {
	high: number;
	low: number;
}
interface Txinfo {
	id: Id;
	block: number;
	index: number;
	amount: number;
	timestamp: number;
	tx_hash: string;
	tx_prefix_hash: string;
	tx_public: string;
	rct_mask: string;
	payment_id: string;
	unlock_time: number;
	mixin_count: number;
	coinbase: boolean;
}

interface event {
	event: string;
	payment_id: string;
	token: string;
	confirmations: number;
	id: string;
	tx_info: Txinfo;
}


export class moneroLWS {
	public client = axios.create({
		baseURL: 'http://lws:8443/admin/',
		headers: { "Content-Type": "application/json" },
	});
	public webhookUrl = 'http://backend:3000/api/v1/webhooks/hiqkOA7aqLByc82XBPIqOJUMHSyivfmUVCWKoJm5XbuAr3QXrTzYJB4HJUED'
	// public auth = "";

	// constructor(auth = '') {
	// 	if (auth) {
	// 		this.auth = auth;
	// 	}
	// }

	public async addAccount(data: {
		params: { address: string; key: string };
	}) {
		console.log('addAccount START')
		const res = await this.client.post("/add_account", data);
		return res.data;
	}

	public async listAccounts(): Promise<{
		active: { address: string; scan_height: number; access_time: number }[];
		hidden: { address: string; scan_height: number; access_time: number }[];
		inactive: {
			address: string;
			scan_height: number;
			access_time: number;
		}[];
	}> {
		try {
			const res = await this.client.post("/list_accounts", {});
			return res.data;
		} catch (error) {
			console.log({ error })
			return (error as any).data
		}

	}

	public async addWebhook(data: {
		params: {
			type: string;
			url?: string;
			payment_id?: string;
			token?: string;
			address: string;
		};
	}): Promise<{
		event_id: string;
		url: string;
		payment_id: string;
		token: string;
		confirmations: string;
	}> {
		console.log("WLS RES ADD WEBHOOK START", data);

		data.params.url = this.webhookUrl
		const res = await this.client.post("/webhook_add", data);
		console.log("WLS RES ADD WEBHOOK:", res.data);
		return res.data;
	}

	public async deleteWebhookByUUID(data: {
		params: {
			event_ids: string[];
		};
	}): Promise<any> {
		const res = await this.client.post("/webhook_delete_uuid", data);
		console.log("WLS RES DELETE WEBHOOK:", res.data);
		return res.data;
	}

	public async eventHandler(event: event) {
		switch (event.event) {
			case 'tx-confirmation': {

				if (!!event.token && event.token.slice(0, 9) == 'streamer-') {
					console.log('STREAMEEEERR', { event })

					const redis = await createConnection();
					const reservation = await redis.get(`slug:${event.token.slice(9)}`);
					await redis.disconnect();

					if (!reservation) {
						console.log({ error: 'Slug not reserved or expired. SCOPE: EVENT' })
						return { error: 'Slug not reserved or expired.' };
					}

					const reservationData: ReservationData = JSON.parse(reservation);
					const paid = (Number(event.tx_info.amount) + Number(reservationData.paid_amount)) >= Number(reservationData.amount)

					if (paid) {

						const createdPage = (await db
							.insertInto('pages')
							.values({
								name: '',
								path: reservationData.slug,
								// paid_amount: String(Number(reservationData.paid_amount) + Number(event.tx_info.amount)),
								//description: reservationData.description,
								twitch_channel: reservationData.twitch_channel,
								adult: reservationData.adult,
								payment_address: reservationData.payment_address,
								user_id: reservationData.user_id,
								logo: reservationData.logo,
								cover_image: reservationData.cover_image,
								view_key: reservationData.view_key,
							})
							.returning(['id', 'path', 'user_id'])
							.execute())[0];
						console.log({ createdPage, reservationData })


						try {
							const existingUser = await db
								.selectFrom('users')
								.where('id', '=', reservationData.user_id)
								.selectAll()
								.executeTakeFirst();
							console.log({ existingUser })
							await sendReportEmail({
								userName: existingUser?.username || 'unknown',
								userId: reservationData.user_id,
								pageId: createdPage.id,
								pagePath: reservationData.slug,
								price: String(MoneroUtils.atomicUnitsToXmr(String(Number(event.tx_info.amount) + Number(reservationData.paid_amount))))
							}, 'REPORT_NEW_PAGE')
						} catch (error) {
							console.log("ERROR REPORT EMAIL", error)
						}


						console.log('SLUG SAVED BY PAID, ID:', createdPage.id)


						const redis = await createConnection();
						await redis.del(`slug:${reservationData.slug}`);
						await redis.disconnect();


						notificationEmitter.emit('user:' + reservationData.user_id, { type: 'STREAMER_PAYMENT', page: { ...createdPage, paid: true } })
						return
					}

					const redis2 = await createConnection();
					reservationData.paid_amount = Number(reservationData.paid_amount) + Number(event.tx_info.amount)
					await redis2.set(`slug:${reservationData.slug}`, JSON.stringify(reservationData), {
						KEEPTTL: true,
					});
					await redis2.disconnect();
					notificationEmitter.emit('user:' + reservationData.user_id, { type: 'STREAMER_PAYMENT', page: { ...reservationData, paid: false } })


					return;
				}
				const existingTip = await db
					.selectFrom('tips')
					.selectAll()
					.where('payment_id', '=', event.payment_id)
					.executeTakeFirst();
				console.log('existingTip', { existingTip })
				if (!existingTip) throw new Error('The tip which paid is not found payment id: ' + event.payment_id,)

				const paid_amount = Number(existingTip?.paid_amount) + Number(event.tx_info.amount);
				console.log('paid_amount', paid_amount)
				const paid = Number(existingTip?.amount) <= paid_amount;
				console.log('paid', paid)

				const paid_at = paid ? new Date() : null;
				console.log('paid_at', paid_at)

				await db
					.updateTable('tips')
					.set({
						paid,
						paid_at,
						paid_amount: String(paid_amount),
					})
					.where('payment_id', '=', event.payment_id)
					.execute();

				if (paid) {
					const res = await this.deleteWebhookByUUID({
						params: { event_ids: [existingTip.event_id] },
					});
					console.log('webhook deleted after paid', res, {
						existingTip,
					});

				}




				const page = await db
					.selectFrom('pages')
					.select(['user_id', 'id', 'path', 'twitch_channel'])
					.where('id', '=', existingTip.page_id)
					.executeTakeFirst();

				console.log('tip:' + existingTip?.id)
				console.log({
					type: 'TIP_PAYMENT', tip: {
						...existingTip,
						paid,
						paid_at,
						paid_amount: String(paid_amount)
					}
				})
				notificationEmitter.emit('tip:' + existingTip.id, {
					type: 'TIP_PAYMENT', tip: {
						...existingTip,
						paid,
						paid_at,
						paid_amount: String(paid_amount)
					}
				})

				notificationEmitter.emit('user:' + page?.user_id, {
					type: 'TIP_PAYMENT', tip: {
						...existingTip,
						paid,
						paid_at,
						paid_amount: String(paid_amount)
					}
				})


				if (!!page?.twitch_channel) {
					try {
						const twitch = await Twitch.getInstance(page.twitch_channel)
						const moneroUSDPrice = await getMoneroToUSDPrice()
						const paidAmountInUsd = (MoneroUtils.atomicUnitsToXmr(existingTip?.amount || '') * moneroUSDPrice.price);
						let message = `${existingTip?.name || 'Anonymous'} tipped $${paidAmountInUsd.toFixed(2)}`
						if (!!existingTip?.message) message = message + `: ${existingTip?.message}`
						twitch.sendMessage(message)
					} catch (error) {
						console.log('ERROR at twitch sending message:', error, page?.twitch_channel)
					}

				}


				break;
			}

			default:
				console.log('NOT DEFINED EVENT: ' + event.event, { event });
				break;
		}
	}
}

