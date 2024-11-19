import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUniquePageSlugOnPayment1727950923635 implements MigrationInterface {
    name = 'RemoveUniquePageSlugOnPayment1727950923635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "UQ_addfdb30b4ee1c2ef85bd552ff3"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "UQ_addfdb30b4ee1c2ef85bd552ff3" UNIQUE ("page_slug")`);
    }

}
