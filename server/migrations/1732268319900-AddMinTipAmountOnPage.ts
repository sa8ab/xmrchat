import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMinTipAmountOnPage1732268319900 implements MigrationInterface {
    name = 'AddMinTipAmountOnPage1732268319900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ADD "min_tip_amount" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "min_tip_amount"`);
    }

}
