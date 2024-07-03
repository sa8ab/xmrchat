
import {CreateTableBuilder, Kysely, sql} from 'kysely';

const createAddIdForeignKeyFunction = (options: {
	columnName: string;
	tableName: string;
	fkColumnName?: string;
	uuid?: boolean;
}) => {
	return (
		db: CreateTableBuilder<string, string>,
		columnOptions?: {
			deleteBehavior?:
				| 'cascade'
				| 'restrict'
				| 'set null'
				| 'set default'
				| 'no action';
			notNull?: boolean;
		}
	) => {
		options.uuid = options.uuid ?? true;
		columnOptions = columnOptions ?? {
			deleteBehavior: 'cascade',
			notNull: true,
		};

		return db.addColumn(
			options.columnName,
			options.uuid ? 'uuid' : 'integer',
			col => {
				col = col
					.references(
						`${options.tableName}.${options.fkColumnName || 'id'}`
					)
					.onDelete(columnOptions!.deleteBehavior || 'restrict');
				if (columnOptions!.notNull) {
					col = col.notNull();
				}

				return col;
			}
		);
	};
};

const addCreationTimestamp = (db: CreateTableBuilder<string, string>) => {
	return db.addColumn('creation', 'timestamp', col =>
		col.defaultTo(sql`current_timestamp`).notNull()
	);
};

const addUUID4 = (db: CreateTableBuilder<string, string>) => {
	return db.addColumn('id', 'uuid', col =>
		col
			.primaryKey()
			.notNull()
			.defaultTo(sql`uuid_generate_v4()`)
	);
};

export type SchemaTable = (db: Kysely<never>) => CreateTableBuilder<never>;

export {createAddIdForeignKeyFunction, addCreationTimestamp, addUUID4};
