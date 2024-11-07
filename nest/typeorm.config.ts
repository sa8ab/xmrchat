import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  entities: ['**/*.entity.ts'],
  migrations: ['migrations/*'],
  namingStrategy: new SnakeNamingStrategy(),
});
