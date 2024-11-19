import { MigrationInterface, QueryRunner } from "typeorm";

export class JoinColumnOnPayment1727965551686 implements MigrationInterface {
    name = 'JoinColumnOnPayment1727965551686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP CONSTRAINT "pages_payment_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "pages" DROP CONSTRAINT "UQ_b8c20fc2602051daba159ab1590"`);
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "payment_id"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "page_id" integer`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "UQ_902734f656d10e1dec8d5a9f9c0" UNIQUE ("page_id")`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "payments_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "payments_page_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "UQ_902734f656d10e1dec8d5a9f9c0"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "page_id"`);
        await queryRunner.query(`ALTER TABLE "pages" ADD "payment_id" integer`);
        await queryRunner.query(`ALTER TABLE "pages" ADD CONSTRAINT "UQ_b8c20fc2602051daba159ab1590" UNIQUE ("payment_id")`);
        await queryRunner.query(`ALTER TABLE "pages" ADD CONSTRAINT "pages_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
