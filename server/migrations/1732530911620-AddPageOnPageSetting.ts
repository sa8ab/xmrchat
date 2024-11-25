import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPageOnPageSetting1732530911620 implements MigrationInterface {
    name = 'AddPageOnPageSetting1732530911620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page-settings" ADD "page_id" integer`);
        await queryRunner.query(`ALTER TABLE "page-settings" ADD CONSTRAINT "page-settings_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page-settings" DROP CONSTRAINT "page-settings_page_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "page-settings" DROP COLUMN "page_id"`);
    }

}
