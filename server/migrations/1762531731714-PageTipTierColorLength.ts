import { MigrationInterface, QueryRunner } from "typeorm";

export class PageTipTierColorLength1762531731714 implements MigrationInterface {
    name = 'PageTipTierColorLength1762531731714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_tip_tiers" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "page_tip_tiers" ADD "color" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_tip_tiers" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "page_tip_tiers" ADD "color" character varying(7)`);
    }

}
