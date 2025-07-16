import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerificationOnIntegrationConfig1752663843429 implements MigrationInterface {
    name = 'AddVerificationOnIntegrationConfig1752663843429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration_configs" ADD "verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "integration_configs" ADD "verification_code" character varying`);
        await queryRunner.query(`ALTER TABLE "integration_configs" ADD "verification_expires_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration_configs" DROP COLUMN "verification_expires_at"`);
        await queryRunner.query(`ALTER TABLE "integration_configs" DROP COLUMN "verification_code"`);
        await queryRunner.query(`ALTER TABLE "integration_configs" DROP COLUMN "verified"`);
    }

}
