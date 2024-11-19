import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEventIdOnPayment1727948199272 implements MigrationInterface {
    name = 'AddEventIdOnPayment1727948199272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP CONSTRAINT "pages_payment_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "event_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "UQ_f08b71380816f776522a404335e" UNIQUE ("event_id")`);
        await queryRunner.query(`ALTER TABLE "pages" ADD CONSTRAINT "pages_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP CONSTRAINT "pages_payment_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "UQ_f08b71380816f776522a404335e"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "event_id"`);
        await queryRunner.query(`ALTER TABLE "pages" ADD CONSTRAINT "pages_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
