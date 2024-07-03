
import type {DB} from '../types/db';

import {Kysely, PostgresDialect} from 'kysely';
import {Pool} from 'pg';

const pool = new Pool({
	database: process.env.DB_NAME,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	max: 20,
});

const db = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool,
	}),
});

export {pool, db};
