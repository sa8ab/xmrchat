import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultTipAmountDisplay1734253307125 implements MigrationInterface {
    name = 'AddDefaultTipAmountDisplay1734253307125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ADD "default_tip_amount_display" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "default_tip_amount_display"`);
    }

}
