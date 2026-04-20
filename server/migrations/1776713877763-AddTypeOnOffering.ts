import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeOnOffering1776713877763 implements MigrationInterface {
    name = 'AddTypeOnOffering1776713877763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offerings" ADD "type" character varying NOT NULL DEFAULT 'telegram'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offerings" DROP COLUMN "type"`);
    }

}
