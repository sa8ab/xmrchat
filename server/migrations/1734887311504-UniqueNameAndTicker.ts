import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueNameAndTicker1734887311504 implements MigrationInterface {
    name = 'UniqueNameAndTicker1734887311504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coins" ADD CONSTRAINT "name-and-ticker" UNIQUE ("name", "ticker")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coins" DROP CONSTRAINT "name-and-ticker"`);
    }

}
