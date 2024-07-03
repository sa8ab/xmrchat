import { bool, cleanEnv, host, num, port, str } from 'envalid';

const env = cleanEnv(process.env, {
	APP_NAME: str({
		desc: 'The name of the application.',
		example: 'MyApp',
	}),
	APP_HOST: host({
		desc: 'The hostname of the application.',
		example: 'localhost',
		devDefault: 'localhost',
	}),
	APP_PORT: port({
		desc: "The port for the application's server to listen on.",
		example: '3000',
		devDefault: 3000,
	}),

	DB_NAME: str({
		desc: 'The name of the database.',
		example: 'my_database',
	}),
	DB_HOST: host({
		desc: 'The hostname of the database.',
		example: 'localhost',
		devDefault: 'localhost',
	}),
	DB_USER: str({
		desc: 'The username for the database.',
		example: 'root',
	}),
	DB_PASSWORD: str({
		desc: 'The password for the database.',
		example: 'password',
	}),
	DB_PORT: port({
		desc: 'The port for the database. Defaults to 5432.',
		example: '5432',
		default: 5432,
	}),

	REDIS_HOST: host({
		desc: 'The hostname of the Redis server.',
		example: 'localhost',
		devDefault: 'localhost',
	}),
	REDIS_USER: str({
		desc: 'The username for the Redis server.',
		example: 'root',
		default: '',
	}),
	REDIS_PASSWORD: str({
		desc: 'The password for the Redis server.',
		example: 'password',
		default: '',
	}),
	REDIS_PORT: port({
		desc: 'The port for the Redis server. Defaults to 6379.',
		example: '6379',
		default: 6379,
	}),
	FEED_LIMIT: num({
		desc: 'The maximum number of tips to return in the feed at a time.',
		example: '50',
		default: 50,
	}),
	SLUG_RESERVE_MINS: num({
		desc: 'The number of minutes to reserve a slug for.',
		example: '5',
		default: 5,
	}),
	SLUG_RESERVE_AMOUNT: str({
		desc: 'The amount to reserve for a slug in atomic units.',
		example: '1000000000',
		default: '1000000000',
	}),
	FILE_UPLOAD_PATH: str({
		desc: 'The path to upload files to.',
		example: './uploads',
	}),
	MIN_TIP_AMOUNT: str({
		desc: 'The minimum amount for a tip.',
		example: '1000000000',
		default: '1000000000',
	}),
	// MAIL SERVER
	MAIL_HOST: host({
		desc: 'The host of mail server.',
		example: 'mx1.anne.media',
	}),
	MAIL_PORT: num({
		desc: 'The port of mail server.',
		example: '465',
	}),
	MAIL_USERNAME: str({
		desc: 'auth username.',
		example: 'admin@xmrchat.com',
	}),
	MAIL_PASSWORD: str({
		desc: 'The minimum amount for a tip.',
		example: '5RFlfroQyzttLEH$t17I5FBFRJPGBE!w',
	}),
	MAIL_FROM_ADDRESS: str({
		desc: 'address of sender.',
		example: 'no-reply@xmrchat.com',
	}),
	MAIL_FROM_NAME: str({
		desc: 'name of sender.',
		example: 'support',
	}),
	MAIL_ENCRYPTION: bool({
		desc: 'over ssl or not.',
		example: 'false',
	}),
	MONERO_LWS_URL: str({
		desc: 'The hostname of the monero lws container.',
		example: 'http://lws:8443/admin/',
		devDefault: 'http://lws:8443/admin/',
	}),
	MONERO_LWS_WEBHOOK_URL: str({
		desc: 'The url that monero lws call for webhook.',
		example: 'http://backend:3000/api/v1/webhooks',
		devDefault: 'http://backend:3000/api/v1/webhooks',
	}),
	MONERO_LWS_WEBHOOK_SECURE_TOKEN: str({
		desc: 'The url path that it is a secret for monero lws webhook call.',
		example: 'secureTOKENdsifajhurebjknsd',
		devDefault: 'secureTOKENdsifajhurebjknsd',
	}),
	MONERO_ADMIN_WALLET_PRIMARY_ADDRESS: str({
		desc: 'Wallet primary address to pay by your client.',
		example: 'sampleaddress',
		devDefault: 'sampleaddress',
	}),
	MONERO_ADMIN_WALLET_PRIVATE_VIEW_KEY: str({
		desc: 'Wallet private view key.',
		example: 'sample',
		devDefault: 'sample',
	}),
	DOMAIN_NAME: str({
		desc: 'pure Domain name like xmrchat.com without any https or "/"',
		example: 'xmrchat.com',
		devDefault: 'xmrchat.com',
	}),
});

// @ts-expect-error This is a hack to make the cleaned env available globally.
process.env = {
	...process.env,
	...env,
};

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: string;

			APP_NAME: string;
			APP_HOST: string;
			APP_PORT: string;

			DB_NAME: string;
			DB_HOST: string;
			DB_USER: string;
			DB_PASSWORD: string;
			DB_PORT: number;
			REDIS_HOST: string;
			REDIS_USER: string;
			REDIS_PASSWORD: string;
			REDIS_PORT: number;
			WALLET_HEIGHT: number;
			FEED_LIMIT: number;
			SLUG_RESERVE_MINS: number;
			SLUG_RESERVE_AMOUNT: string;
			FILE_UPLOAD_PATH: string;
			MAIL_HOST: string;
			MAIL_PORT: number;
			MAIL_USERNAME: string;
			MAIL_PASSWORD: string;
			MAIL_ENCRYPTION: boolean;
			MAIL_FROM_ADDRESS: string;
			MAIL_FROM_NAME: string;
			MONERO_LWS_URL: string;
			MONERO_LWS_WEBHOOK_URL: string;
			MONERO_LWS_WEBHOOK_SECURE_TOKEN: string;
			MONERO_ADMIN_WALLET_PRIMARY_ADDRESS: string;
			MONERO_ADMIN_WALLET_PRIVATE_VIEW_KEY: string;
			DOMAIN_NAME: string;
		}
	}
}
