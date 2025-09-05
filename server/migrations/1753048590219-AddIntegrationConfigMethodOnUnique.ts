import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIntegrationConfigMethodOnUnique1753048590219 implements MigrationInterface {
    name = 'AddIntegrationConfigMethodOnUnique1753048590219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration_configs" DROP CONSTRAINT "unique-page-and-type"`);
        await queryRunner.query(`ALTER TABLE "integration_configs" ADD CONSTRAINT "unique-page-and-type-and-method" UNIQUE ("page_id", "type", "method")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration_configs" DROP CONSTRAINT "unique-page-and-type-and-method"`);
        await queryRunner.query(`ALTER TABLE "integration_configs" ADD CONSTRAINT "unique-page-and-type" UNIQUE ("type", "page_id")`);
    }

}
