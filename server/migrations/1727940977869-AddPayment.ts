import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPayment1727940977869 implements MigrationInterface {
  name = 'AddPayment1727940977869';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" SERIAL PRIMARY KEY NOT NULL, "amount" character varying(32) NOT NULL, "paid_amount" character varying(32) NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "paid_at" TIMESTAMP WITH TIME ZONE)`,
    );
    await queryRunner.query(`ALTER TABLE "pages" ADD "payment_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "pages" ADD CONSTRAINT "UQ_b8c20fc2602051daba159ab1590" UNIQUE ("payment_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pages" ADD CONSTRAINT "pages_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pages" DROP CONSTRAINT "pages_payment_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pages" DROP CONSTRAINT "UQ_b8c20fc2602051daba159ab1590"`,
    );
    await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "payment_id"`);
    await queryRunner.query(`DROP TABLE "payments"`);
  }
}
