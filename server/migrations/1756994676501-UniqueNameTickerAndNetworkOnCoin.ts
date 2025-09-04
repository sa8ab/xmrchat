import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueNameTickerAndNetworkOnCoin1756994676501 implements MigrationInterface {
    name = 'UniqueNameTickerAndNetworkOnCoin1756994676501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coins" DROP CONSTRAINT "name-and-ticker"`);
        await queryRunner.query(`ALTER TABLE "coins" ADD CONSTRAINT "name-and-ticker-and-network" UNIQUE ("name", "ticker", "network")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coins" DROP CONSTRAINT "name-and-ticker-and-network"`);
        await queryRunner.query(`ALTER TABLE "coins" ADD CONSTRAINT "name-and-ticker" UNIQUE ("name", "ticker")`);
    }

}
