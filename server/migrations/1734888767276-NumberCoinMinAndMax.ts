import { MigrationInterface, QueryRunner } from "typeorm";

export class NumberCoinMinAndMax1734888767276 implements MigrationInterface {
    name = 'NumberCoinMinAndMax1734888767276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coins" DROP COLUMN "minimum"`);
        await queryRunner.query(`ALTER TABLE "coins" ADD "minimum" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coins" DROP COLUMN "maximum"`);
        await queryRunner.query(`ALTER TABLE "coins" ADD "maximum" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coins" DROP COLUMN "maximum"`);
        await queryRunner.query(`ALTER TABLE "coins" ADD "maximum" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coins" DROP COLUMN "minimum"`);
        await queryRunner.query(`ALTER TABLE "coins" ADD "minimum" bigint NOT NULL`);
    }

}
