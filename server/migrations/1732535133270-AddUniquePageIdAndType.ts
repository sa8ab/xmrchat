import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniquePageIdAndType1732535133270 implements MigrationInterface {
    name = 'AddUniquePageIdAndType1732535133270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page-settings" ADD CONSTRAINT "unique-page-and-key" UNIQUE ("page_id", "key")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page-settings" DROP CONSTRAINT "unique-page-and-key"`);
    }

}
