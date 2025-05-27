import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTipRemovalAndPageExpiration1748015243028 implements MigrationInterface {
    name = 'AddTipRemovalAndPageExpiration1748015243028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ADD "expiration_minutes" integer`);
        await queryRunner.query(`ALTER TABLE "tips" ADD "removal_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tips" DROP COLUMN "removal_at"`);
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "expiration_minutes"`);
    }

}
