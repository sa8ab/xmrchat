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

	WALLET_RPC_HOST: host({
		desc: 'The host of the Monero wallet RPC server.',
		example: 'localhost',
		devDefault: '127.0.0.1',
	}),
	WALLET_RPC_PORT: num({
		desc: 'The port for the Monero wallet RPC server.',
		example: '18082',
		default: 18082,
	}),
	WALLET_RPC_USER: str({
		desc: 'The username for the Monero wallet RPC server.',
		example: 'root',
	}),
	WALLET_RPC_PASSWORD: str({
		desc: 'The password for the Monero wallet RPC server.',
		example: 'password',
	}),
	WALLET_NAME: str({
		desc: 'The name of the Monero wallet to use.',
		example: 'MyWallet',
	}),
	WALLET_PASSWORD: str({
		desc: 'The password for the Monero wallet to use.',
		example: 'password',
	}),
	WALLET_ACCOUNT: num({
		desc: 'The account to use in the Monero wallet.',
		example: '0',
		default: 0,
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
	TWITCH_CLIENT_ID: str({
		desc: 'twitch bot client Id.',
		example: 'jfknhejkbgiu4bfjwciua',
	}),
	TWITCH_CLIENT_SECRET: str({
		desc: 'twitch bot client secret.',
		example: 'jfknhejkbgiu4bfjwciua',
	}),
	TWITCH_INITIAL_ACCESS_TOKEN: str({
		desc: 'twitch initial access token.',
		example: 'jfknhejkbgiu4bfjwciua',
	}),
	TWITCH_INITIAL_REFRESH_TOKEN: str({
		desc: 'twitch initial Refresh token.',
		example: 'jfknhejkbgiu4bfjwciua',
	}),
	TWITCH_BOT_NAME: str({
		desc: 'twitch bot name.',
		example: 'xmrchatbot',
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
			MIN_TIP_AMOUNT: string;

			REDIS_HOST: string;
			REDIS_USER: string;
			REDIS_PASSWORD: string;
			REDIS_PORT: number;

			WALLET_RPC_HOST: string;
			WALLET_RPC_PORT: number;
			WALLET_RPC_USER: string;
			WALLET_RPC_PASSWORD: string;
			WALLET_NAME: string;
			WALLET_PASSWORD: string;
			WALLET_ACCOUNT: number;

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

			TWITCH_CLIENT_ID: string;
			TWITCH_CLIENT_SECRET: string;
			TWITCH_BOT_NAME: string;
			TWITCH_INITIAL_ACCESS_TOKEN: string;
			TWITCH_INITIAL_REFRESH_TOKEN: string;
		}
	}
}

