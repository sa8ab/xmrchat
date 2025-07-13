import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSimplexOnIntegrationConfig1752414412942 implements MigrationInterface {
    name = 'AddSimplexOnIntegrationConfig1752414412942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration_configs" DROP CONSTRAINT "unique-page-and-type"`);
        await queryRunner.query(`ALTER TYPE "public"."integration_configs_type_enum" RENAME TO "integration_configs_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."integration_configs_type_enum" AS ENUM('singal', 'telegram', 'simplex')`);
        await queryRunner.query(`ALTER TABLE "integration_configs" ALTER COLUMN "type" TYPE "public"."integration_configs_type_enum" USING "type"::"text"::"public"."integration_configs_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."integration_configs_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "integration_configs" ADD CONSTRAINT "unique-page-and-type" UNIQUE ("page_id", "type")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration_configs" DROP CONSTRAINT "unique-page-and-type"`);
        await queryRunner.query(`CREATE TYPE "public"."integration_configs_type_enum_old" AS ENUM('singal', 'telegram')`);
        await queryRunner.query(`ALTER TABLE "integration_configs" ALTER COLUMN "type" TYPE "public"."integration_configs_type_enum_old" USING "type"::"text"::"public"."integration_configs_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."integration_configs_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."integration_configs_type_enum_old" RENAME TO "integration_configs_type_enum"`);
        await queryRunner.query(`ALTER TABLE "integration_configs" ADD CONSTRAINT "unique-page-and-type" UNIQUE ("type", "page_id")`);
    }

}
