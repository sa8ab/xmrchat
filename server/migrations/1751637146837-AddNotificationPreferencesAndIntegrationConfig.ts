import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotificationPreferencesAndIntegrationConfig1751637146837 implements MigrationInterface {
    name = 'AddNotificationPreferencesAndIntegrationConfig1751637146837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_type_enum" AS ENUM('new_tip')`);
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_channel_enum" AS ENUM('email', 'webhook', 'telegram', 'singal')`);
        await queryRunner.query(`CREATE TABLE "notification_preferences" ("id" SERIAL NOT NULL, "type" "public"."notification_preferences_type_enum" NOT NULL, "channel" "public"."notification_preferences_channel_enum" NOT NULL, "enabled" boolean, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "page_id" integer, CONSTRAINT "unique-page-and-type-and-channel" UNIQUE ("page_id", "type", "channel"), CONSTRAINT "PK_e94e2b543f2f218ee68e4f4fad2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."integration_configs_type_enum" AS ENUM('singal', 'telegram')`);
        await queryRunner.query(`CREATE TABLE "integration_configs" ("id" SERIAL NOT NULL, "type" "public"."integration_configs_type_enum" NOT NULL, "config" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "page_id" integer, CONSTRAINT "unique-page-and-type" UNIQUE ("page_id", "type"), CONSTRAINT "PK_5ca9b0024e0f8a3f00222bbe09d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "FK_5aa42dd67a66eb001a42674ad7c" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "integration_configs" ADD CONSTRAINT "FK_00c187a697145604008d4c8c837" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration_configs" DROP CONSTRAINT "FK_00c187a697145604008d4c8c837"`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "FK_5aa42dd67a66eb001a42674ad7c"`);
        await queryRunner.query(`DROP TABLE "integration_configs"`);
        await queryRunner.query(`DROP TYPE "public"."integration_configs_type_enum"`);
        await queryRunner.query(`DROP TABLE "notification_preferences"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_channel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_type_enum"`);
    }

}
