import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIntegrationMethod1753047693759 implements MigrationInterface {
    name = 'AddIntegrationMethod1753047693759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration_configs" ADD "method" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration_configs" DROP COLUMN "method"`);
    }

}
