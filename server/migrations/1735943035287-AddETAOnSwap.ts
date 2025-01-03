import { MigrationInterface, QueryRunner } from "typeorm";

export class AddETAOnSwap1735943035287 implements MigrationInterface {
    name = 'AddETAOnSwap1735943035287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap" ADD "eta" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap" DROP COLUMN "eta"`);
    }

}
