// eslint-disable-next-line node/no-unsupported-features/node-builtins
import {promises, readdirSync} from 'fs';
import path from 'path';
import {Migrator, FileMigrationProvider} from 'kysely';
import './src/env';
import {db} from './src/db/connect';

const runMigrations = () => {
	console.log('Running migrations...');
	console.log(__dirname);

	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs: promises,
			path,
			migrationFolder: path.join(__dirname, '/src/db/migrations'),
		}),
	});

	migrator.migrateToLatest().then(({error, results}) => {
		console.log(results);

		if (error) {
			db.destroy().then(() => {
				console.error(error);
				throw new Error('Failed to migrate.');
			});
		} else {
			db.destroy().then(() => {
				console.log('Migration successful.');
			});
		}
	});
};

const createMigration = () => {
	const readline = require('readline');
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.question('Enter migration name: ', (name: string) => {
		const TS_MIGRATION_DIRECTORY = './src/db/migrations';
		const MIGRATION_FILE_CONTENT = `import {Kysely} from 'kysely';

export async function up(db: Kysely<never>): Promise<void> {
\t// Migration code
}

export async function down(db: Kysely<never>): Promise<void> {
\t// Migration code
}
`;

		const fileCount = readdirSync(TS_MIGRATION_DIRECTORY).length;

		const fileName = `${fileCount}_${name}_${Math.round(
			new Date().getTime() / 1000
		)}.ts`;
		console.log(`Creating migration file ${fileName}...`);

		promises
			.writeFile(
				path.join(TS_MIGRATION_DIRECTORY, fileName),
				MIGRATION_FILE_CONTENT,
				'utf-8'
			)
			.then(() => {
				console.log('Migration file ' + fileName + ' created.');
				rl.close();
			})
			.catch(err => {
				console.error('Failed to create migration file.');
				console.error(err);
				rl.close();
			});
	});
};

const command = process.argv[2];
switch (command) {
	case 'create':
		createMigration();
		break;
	case 'run':
		runMigrations();
		break;
	default:
		console.log('Usage:\n\tdbMigration <create|run>\n');
		break;
}

//TODO down migration
