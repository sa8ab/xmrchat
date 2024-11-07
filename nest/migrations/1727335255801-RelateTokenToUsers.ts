import { MigrationInterface, QueryRunner } from 'typeorm';

export class RelateTokenToUsers1727335255801 implements MigrationInterface {
  name = 'RelateTokenToUsers1727335255801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user-tokens" ADD "user_id" integer REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user-tokens" DROP COLUMN "user_id"`);
  }
}
