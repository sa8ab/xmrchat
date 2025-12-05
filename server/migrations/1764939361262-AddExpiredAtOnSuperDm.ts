import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExpiredAtOnSuperDm1764939361262 implements MigrationInterface {
    name = 'AddExpiredAtOnSuperDm1764939361262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "super_dms" ADD "expires_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "super_dms" DROP COLUMN "expires_at"`);
    }

}
