import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDataOnEntitlement1778521444674 implements MigrationInterface {
    name = 'AddDataOnEntitlement1778521444674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entitlements" ADD "data" jsonb`);
        await queryRunner.query(`ALTER TABLE "page-settings" DROP CONSTRAINT "unique-page-and-key"`);
        await queryRunner.query(`ALTER TYPE "public"."page-settings_category_enum" RENAME TO "page-settings_category_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."page-settings_category_enum" AS ENUM('obs', 'streaming', 'notifications', 'super-dm', 'paid-content')`);
        await queryRunner.query(`ALTER TABLE "page-settings" ALTER COLUMN "category" TYPE "public"."page-settings_category_enum" USING "category"::"text"::"public"."page-settings_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."page-settings_category_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."page-settings_key_enum" RENAME TO "page-settings_key_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."page-settings_key_enum" AS ENUM('twitch-channel', 'obs-keep-messages', 'obs-play-sound', 'obs-auto-show-tips', 'obs-sound', 'min-notification-threshold', 'daily-summary-notification-time', 'super-dm-min-amount', 'super-dm-public-key', 'super-dm-active', 'telegram-user-id', 'telegram-paid-content-id')`);
        await queryRunner.query(`ALTER TABLE "page-settings" ALTER COLUMN "key" TYPE "public"."page-settings_key_enum" USING "key"::"text"::"public"."page-settings_key_enum"`);
        await queryRunner.query(`DROP TYPE "public"."page-settings_key_enum_old"`);
        await queryRunner.query(`ALTER TABLE "page-settings" ADD CONSTRAINT "unique-page-and-key" UNIQUE ("page_id", "key")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page-settings" DROP CONSTRAINT "unique-page-and-key"`);
        await queryRunner.query(`CREATE TYPE "public"."page-settings_key_enum_old" AS ENUM('twitch-channel', 'obs-keep-messages', 'obs-play-sound', 'obs-auto-show-tips', 'obs-sound', 'min-notification-threshold', 'daily-summary-notification-time', 'super-dm-min-amount', 'super-dm-public-key', 'super-dm-active')`);
        await queryRunner.query(`ALTER TABLE "page-settings" ALTER COLUMN "key" TYPE "public"."page-settings_key_enum_old" USING "key"::"text"::"public"."page-settings_key_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."page-settings_key_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."page-settings_key_enum_old" RENAME TO "page-settings_key_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."page-settings_category_enum_old" AS ENUM('obs', 'streaming', 'notifications', 'super-dm')`);
        await queryRunner.query(`ALTER TABLE "page-settings" ALTER COLUMN "category" TYPE "public"."page-settings_category_enum_old" USING "category"::"text"::"public"."page-settings_category_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."page-settings_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."page-settings_category_enum_old" RENAME TO "page-settings_category_enum"`);
        await queryRunner.query(`ALTER TABLE "page-settings" ADD CONSTRAINT "unique-page-and-key" UNIQUE ("key", "page_id")`);
        await queryRunner.query(`ALTER TABLE "entitlements" DROP COLUMN "data"`);
    }

}
