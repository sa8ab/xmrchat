import {Kysely} from 'kysely';

export async function up(db: Kysely<never>): Promise<void> {
	await db.schema
		.alterTable('tips')
		.addColumn('height', 'integer', c => c.notNull().defaultTo(3100000))
		.execute();
}

export async function down(db: Kysely<never>): Promise<void> {
	await db.schema.alterTable('tips').dropColumn('height').execute();
}
