import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSimplexInNotificationChannel1752518916076 implements MigrationInterface {
    name = 'AddSimplexInNotificationChannel1752518916076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "unique-page-and-type-and-channel"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_preferences_channel_enum" RENAME TO "notification_preferences_channel_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_channel_enum" AS ENUM('email', 'webhook', 'telegram', 'singal', 'simplex')`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ALTER COLUMN "channel" TYPE "public"."notification_preferences_channel_enum" USING "channel"::"text"::"public"."notification_preferences_channel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_channel_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "unique-page-and-type-and-channel" UNIQUE ("page_id", "type", "channel")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "unique-page-and-type-and-channel"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_channel_enum_old" AS ENUM('email', 'webhook', 'telegram', 'singal')`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ALTER COLUMN "channel" TYPE "public"."notification_preferences_channel_enum_old" USING "channel"::"text"::"public"."notification_preferences_channel_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_channel_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_preferences_channel_enum_old" RENAME TO "notification_preferences_channel_enum"`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "unique-page-and-type-and-channel" UNIQUE ("type", "channel", "page_id")`);
    }

}
