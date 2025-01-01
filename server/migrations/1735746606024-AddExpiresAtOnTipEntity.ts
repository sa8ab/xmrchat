import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExpiresAtOnTipEntity1735746606024 implements MigrationInterface {
    name = 'AddExpiresAtOnTipEntity1735746606024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tips" ADD "expires_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tips" DROP COLUMN "expires_at"`);
    }

}
