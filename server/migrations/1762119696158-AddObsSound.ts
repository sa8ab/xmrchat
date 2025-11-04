import { MigrationInterface, QueryRunner } from "typeorm";

export class AddObsSound1762119696158 implements MigrationInterface {
    name = 'AddObsSound1762119696158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."files_type_enum" RENAME TO "files_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."files_type_enum" AS ENUM('page-logo', 'page-banner', 'obs-sound')`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "type" TYPE "public"."files_type_enum" USING "type"::"text"::"public"."files_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."files_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "page-settings" DROP CONSTRAINT "unique-page-and-key"`);
        await queryRunner.query(`ALTER TYPE "public"."page-settings_key_enum" RENAME TO "page-settings_key_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."page-settings_key_enum" AS ENUM('twitch-channel', 'obs-keep-messages', 'obs-play-sound', 'obs-auto-show-tips', 'obs-sound', 'min-notification-threshold', 'daily-summary-notification-time')`);
        await queryRunner.query(`ALTER TABLE "page-settings" ALTER COLUMN "key" TYPE "public"."page-settings_key_enum" USING "key"::"text"::"public"."page-settings_key_enum"`);
        await queryRunner.query(`DROP TYPE "public"."page-settings_key_enum_old"`);
        await queryRunner.query(`ALTER TABLE "page-settings" ADD CONSTRAINT "unique-page-and-key" UNIQUE ("page_id", "key")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page-settings" DROP CONSTRAINT "unique-page-and-key"`);
        await queryRunner.query(`CREATE TYPE "public"."page-settings_key_enum_old" AS ENUM('twitch-channel', 'obs-keep-messages', 'obs-play-sound', 'obs-auto-show-tips', 'min-notification-threshold', 'daily-summary-notification-time')`);
        await queryRunner.query(`ALTER TABLE "page-settings" ALTER COLUMN "key" TYPE "public"."page-settings_key_enum_old" USING "key"::"text"::"public"."page-settings_key_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."page-settings_key_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."page-settings_key_enum_old" RENAME TO "page-settings_key_enum"`);
        await queryRunner.query(`ALTER TABLE "page-settings" ADD CONSTRAINT "unique-page-and-key" UNIQUE ("key", "page_id")`);
        await queryRunner.query(`CREATE TYPE "public"."files_type_enum_old" AS ENUM('page-logo')`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "type" TYPE "public"."files_type_enum_old" USING "type"::"text"::"public"."files_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."files_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."files_type_enum_old" RENAME TO "files_type_enum"`);
    }

}
