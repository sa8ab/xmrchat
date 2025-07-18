import { MigrationInterface, QueryRunner } from "typeorm";

export class AddScheduledNotificationType1751841648843 implements MigrationInterface {
    name = 'AddScheduledNotificationType1751841648843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page-settings" DROP CONSTRAINT "unique-page-and-key"`);
        await queryRunner.query(`ALTER TYPE "public"."page-settings_key_enum" RENAME TO "page-settings_key_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."page-settings_key_enum" AS ENUM('twitch-channel', 'obs-keep-messages', 'obs-play-sound', 'obs-auto-show-tips', 'min-notification-threshold', 'scheduled-daily-notification-time')`);
        await queryRunner.query(`ALTER TABLE "page-settings" ALTER COLUMN "key" TYPE "public"."page-settings_key_enum" USING "key"::"text"::"public"."page-settings_key_enum"`);
        await queryRunner.query(`DROP TYPE "public"."page-settings_key_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "unique-page-and-type-and-channel"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_preferences_type_enum" RENAME TO "notification_preferences_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_type_enum" AS ENUM('new_tip', 'scheduled_tips')`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ALTER COLUMN "type" TYPE "public"."notification_preferences_type_enum" USING "type"::"text"::"public"."notification_preferences_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "page-settings" ADD CONSTRAINT "unique-page-and-key" UNIQUE ("page_id", "key")`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "unique-page-and-type-and-channel" UNIQUE ("page_id", "type", "channel")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "unique-page-and-type-and-channel"`);
        await queryRunner.query(`ALTER TABLE "page-settings" DROP CONSTRAINT "unique-page-and-key"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_type_enum_old" AS ENUM('new_tip')`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ALTER COLUMN "type" TYPE "public"."notification_preferences_type_enum_old" USING "type"::"text"::"public"."notification_preferences_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_preferences_type_enum_old" RENAME TO "notification_preferences_type_enum"`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "unique-page-and-type-and-channel" UNIQUE ("type", "channel", "page_id")`);
        await queryRunner.query(`CREATE TYPE "public"."page-settings_key_enum_old" AS ENUM('twitch-channel', 'obs-keep-messages', 'obs-play-sound', 'obs-auto-show-tips', 'min-notification-threshold')`);
        await queryRunner.query(`ALTER TABLE "page-settings" ALTER COLUMN "key" TYPE "public"."page-settings_key_enum_old" USING "key"::"text"::"public"."page-settings_key_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."page-settings_key_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."page-settings_key_enum_old" RENAME TO "page-settings_key_enum"`);
        await queryRunner.query(`ALTER TABLE "page-settings" ADD CONSTRAINT "unique-page-and-key" UNIQUE ("key", "page_id")`);
    }

}
