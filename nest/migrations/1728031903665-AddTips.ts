import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTips1728031903665 implements MigrationInterface {
  name = 'AddTips1728031903665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tips" ("id" SERIAL PRIMARY KEY NOT NULL, "name" VARCHAR(200) NOT NULL, "message" VARCHAR(2000) NOT NULL, "private" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "page_id" integer)`,
    );
    await queryRunner.query(`ALTER TABLE "payments" ADD "tip_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "UQ_57ef4612d68d556d8000877015e" UNIQUE ("tip_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_57ef4612d68d556d8000877015e" FOREIGN KEY ("tip_id") REFERENCES "tips"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tips" ADD CONSTRAINT "tips_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tips" DROP CONSTRAINT "tips_page_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_57ef4612d68d556d8000877015e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "UQ_57ef4612d68d556d8000877015e"`,
    );
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "tip_id"`);
    await queryRunner.query(`DROP TABLE "tips"`);
  }
}
