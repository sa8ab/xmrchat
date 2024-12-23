import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSwapStatusMessage1734991765240 implements MigrationInterface {
    name = 'AddSwapStatusMessage1734991765240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap" ADD "status_message" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap" DROP COLUMN "status_message"`);
    }

}
