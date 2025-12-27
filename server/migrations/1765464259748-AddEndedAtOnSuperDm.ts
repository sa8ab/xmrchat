import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEndedAtOnSuperDm1765464259748 implements MigrationInterface {
    name = 'AddEndedAtOnSuperDm1765464259748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "super_dms" ADD "ended_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "super_dms" ADD "ended_by_type" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "super_dms" DROP COLUMN "ended_by_type"`);
        await queryRunner.query(`ALTER TABLE "super_dms" DROP COLUMN "ended_at"`);
    }

}
