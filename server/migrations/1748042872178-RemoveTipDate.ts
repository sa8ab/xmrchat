import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTipDate1748042872178 implements MigrationInterface {
    name = 'RemoveTipDate1748042872178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tips" DROP COLUMN "removal_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tips" ADD "removal_at" TIMESTAMP WITH TIME ZONE`);
    }

}
