
import { Kysely, sql } from 'kysely';

import {
	addCreationTimestamp,
	addUUID4,
	createAddIdForeignKeyFunction,
} from '../util';

const user_id = createAddIdForeignKeyFunction({
	columnName: 'user_id',
	tableName: 'users',
});

const page_id = createAddIdForeignKeyFunction({
	columnName: 'page_id',
	tableName: 'pages',
});

const tier_id = createAddIdForeignKeyFunction({
	columnName: 'tier_id',
	tableName: 'page_tiers',
});

export async function up(db: Kysely<never>): Promise<void> {
	await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.execute(db);

	await db.schema
		.createTable('users')
		.$call(addUUID4)
		.addColumn('username', 'varchar(32)', col => col.notNull())
		.addColumn('password', 'varchar(256)', col => col.notNull())
		.addColumn('password_salt', 'varchar(128)', col => col.notNull())
		.addColumn('email', 'varchar(255)')
		.addColumn('is_email_verified', 'boolean', col => col.notNull().defaultTo(false))
		.$call(addCreationTimestamp)

		.execute();

	await db.schema
		.createTable('user_sessions')
		.addColumn('id', 'varchar(64)', col => col.notNull().primaryKey())
		.$call(user_id)
		.addColumn('expires_at', 'timestamp', col => col.notNull())
		.execute();

	await db.schema
		.createTable('pages')
		.$call(addUUID4)
		.$call(user_id)
		.addColumn('name', 'varchar(64)', col => col.notNull())
		.addColumn('path', 'varchar(16)', col => col.notNull().unique())
		.addColumn('featured_tip', 'varchar(64)') // tip_id, cyclic so no foreign key
		.addColumn('description', 'varchar(4096)')
		.addColumn('payment_address', 'varchar(128)', col => col.notNull())
		.addColumn('paid_amount', 'varchar(32)', col => col.defaultTo(0))
		.addColumn('view_key', 'varchar(64)', col => col.notNull())
		.addColumn('logo', 'varchar(64)')
		.addColumn('cover_image', 'varchar(64)')
		.addColumn('adult', 'boolean', col => col.notNull())
		.$call(addCreationTimestamp)
		.execute();

	await db.schema
		.createTable('page_tiers')
		.$call(addUUID4)
		.$call(page_id)
		.addColumn('name', 'varchar(32)', col => col.notNull())
		.addColumn('description', 'varchar(1024)')
		.addColumn('amount', 'varchar(32)', col => col.notNull())
		.$call(addCreationTimestamp)
		.execute();

	await db.schema
		.createTable('tips')
		.$call(addUUID4)
		.$call(page_id)
		.$call(c =>
			tier_id(c, {
				notNull: false,
				deleteBehavior: 'set null',
			})
		)
		.addColumn('name', 'varchar(32)', col => col.notNull())
		.addColumn('amount', 'varchar(32)', col => col.notNull())
		.addColumn('paid_amount', 'varchar(32)', col => col.defaultTo(0))
		.addColumn('message', 'varchar(1024)', col => col.notNull())
		.addColumn('payment_address', 'varchar(128)', col => col.notNull())
		.addColumn('payment_id', 'varchar(128)')
		.addColumn('event_id', 'varchar(128)')
		.addColumn('private', 'boolean', col => col.notNull().defaultTo(false))
		.addColumn('paid', 'boolean', col => col.notNull().defaultTo(false))
		.addColumn('paid_at', 'timestamp')
		.$call(addCreationTimestamp)
		.execute();

	await db.schema
		.createTable('user_tokens')
		.addColumn('type', 'varchar(64)', col => col.notNull().defaultTo('EMAIL_VERIFICATION')) // ENUM: EMAIL_VERIFICATION, RESET_PASSWORD, CHANGE_EMAIL
		.addColumn('token', 'varchar(64)', col => col.notNull())
		.addColumn('id', 'varchar(64)', col => col.notNull().primaryKey())
		.$call(user_id)
		.addColumn('expires_at', 'timestamp', col => col.notNull())
		.$call(addCreationTimestamp)
		.execute();


}



export async function down(db: Kysely<never>): Promise<void> {
	await db.schema.dropTable('tips').execute();
	await db.schema.dropTable('page_tiers').execute();
	await db.schema.dropTable('pages').execute();
	await db.schema.dropTable('user_sessions').execute();
	await db.schema.dropTable('users').execute();
	await db.schema.dropTable('user_tokens').execute();
	await sql`DROP EXTENSION IF EXISTS "uuid-ossp";`.execute(db);
}
