import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPageSlug1727943369750 implements MigrationInterface {
    name = 'AddPageSlug1727943369750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ADD "page_slug" character varying`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "UQ_addfdb30b4ee1c2ef85bd552ff3" UNIQUE ("page_slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "UQ_addfdb30b4ee1c2ef85bd552ff3"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "page_slug"`);
    }

}
