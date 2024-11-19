import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPathToFile1727778641027 implements MigrationInterface {
    name = 'AddPathToFile1727778641027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" ADD "path" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "path"`);
    }

}
