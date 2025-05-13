import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTipDisplayMode1746829832341 implements MigrationInterface {
    name = 'AddTipDisplayMode1746829832341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ADD "tip_display_mode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "tip_display_mode"`);
    }

}
