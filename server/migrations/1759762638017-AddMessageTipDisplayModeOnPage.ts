import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMessageTipDisplayModeOnPage1759762638017 implements MigrationInterface {
    name = 'AddMessageTipDisplayModeOnPage1759762638017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ADD "message_tip_display_mode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "message_tip_display_mode"`);
    }

}
