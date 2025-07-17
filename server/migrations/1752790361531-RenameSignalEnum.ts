import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameSignalEnum1752790361531 implements MigrationInterface {
    name = 'RenameSignalEnum1752790361531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "unique-page-and-type-and-channel"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_preferences_channel_enum" RENAME TO "notification_preferences_channel_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_channel_enum" AS ENUM('email', 'webhook', 'telegram', 'signal', 'simplex')`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ALTER COLUMN "channel" TYPE "public"."notification_preferences_channel_enum" USING "channel"::"text"::"public"."notification_preferences_channel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_channel_enum_old"`);
        await queryRunner.query(`ALTER TABLE "integration_configs" DROP CONSTRAINT "unique-page-and-type"`);
        await queryRunner.query(`ALTER TYPE "public"."integration_configs_type_enum" RENAME TO "integration_configs_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."integration_configs_type_enum" AS ENUM('signal', 'telegram', 'simplex')`);
        await queryRunner.query(`ALTER TABLE "integration_configs" ALTER COLUMN "type" TYPE "public"."integration_configs_type_enum" USING "type"::"text"::"public"."integration_configs_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."integration_configs_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "unique-page-and-type-and-channel" UNIQUE ("page_id", "type", "channel")`);
        await queryRunner.query(`ALTER TABLE "integration_configs" ADD CONSTRAINT "unique-page-and-type" UNIQUE ("page_id", "type")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration_configs" DROP CONSTRAINT "unique-page-and-type"`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "unique-page-and-type-and-channel"`);
        await queryRunner.query(`CREATE TYPE "public"."integration_configs_type_enum_old" AS ENUM('singal', 'telegram', 'simplex')`);
        await queryRunner.query(`ALTER TABLE "integration_configs" ALTER COLUMN "type" TYPE "public"."integration_configs_type_enum_old" USING "type"::"text"::"public"."integration_configs_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."integration_configs_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."integration_configs_type_enum_old" RENAME TO "integration_configs_type_enum"`);
        await queryRunner.query(`ALTER TABLE "integration_configs" ADD CONSTRAINT "unique-page-and-type" UNIQUE ("type", "page_id")`);
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_channel_enum_old" AS ENUM('email', 'webhook', 'telegram', 'singal', 'simplex')`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ALTER COLUMN "channel" TYPE "public"."notification_preferences_channel_enum_old" USING "channel"::"text"::"public"."notification_preferences_channel_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_channel_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_preferences_channel_enum_old" RENAME TO "notification_preferences_channel_enum"`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "unique-page-and-type-and-channel" UNIQUE ("type", "channel", "page_id")`);
    }

}
