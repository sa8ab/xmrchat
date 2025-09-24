import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDataOnLink1758724148588 implements MigrationInterface {
    name = 'AddDataOnLink1758724148588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ADD "data" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "data"`);
    }

}
