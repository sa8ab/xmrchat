import { MigrationInterface, QueryRunner } from 'typeorm';

export class CascadeUserToken1727344227219 implements MigrationInterface {
  name = 'CascadeUserToken1727344227219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user-tokens" DROP CONSTRAINT
      "user-tokens_user_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-tokens" ADD CONSTRAINT "user-tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user-tokens" DROP CONSTRAINT "user-tokens_user_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-tokens" ADD CONSTRAINT "user-tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
