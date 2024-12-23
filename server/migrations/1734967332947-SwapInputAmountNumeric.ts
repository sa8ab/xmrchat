import { MigrationInterface, QueryRunner } from "typeorm";

export class SwapInputAmountNumeric1734967332947 implements MigrationInterface {
    name = 'SwapInputAmountNumeric1734967332947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap" DROP COLUMN "input_amount"`);
        await queryRunner.query(`ALTER TABLE "swap" ADD "input_amount" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap" DROP COLUMN "input_amount"`);
        await queryRunner.query(`ALTER TABLE "swap" ADD "input_amount" character varying(32) NOT NULL`);
    }

}
