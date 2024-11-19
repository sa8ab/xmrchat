import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialUsers1727251784669 implements MigrationInterface {
  name = 'InitialUsers1727251784669';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE users (
        id SERIAL PRIMARY KEY, 
        username VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
        );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
