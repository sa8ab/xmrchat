import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFiatToPage1746830050763 implements MigrationInterface {
    name = 'AddFiatToPage1746830050763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ADD "fiat" character varying DEFAULT 'usd'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "fiat"`);
    }

}
