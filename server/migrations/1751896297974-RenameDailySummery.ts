import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameDailySummery1751896297974 implements MigrationInterface {
    name = 'RenameDailySummery1751896297974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "unique-page-and-type-and-channel"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_preferences_type_enum" RENAME TO "notification_preferences_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_type_enum" AS ENUM('new_tip', 'daily_summury')`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ALTER COLUMN "type" TYPE "public"."notification_preferences_type_enum" USING "type"::"text"::"public"."notification_preferences_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "unique-page-and-type-and-channel" UNIQUE ("page_id", "type", "channel")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "unique-page-and-type-and-channel"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_type_enum_old" AS ENUM('new_tip', 'scheduled_tips')`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ALTER COLUMN "type" TYPE "public"."notification_preferences_type_enum_old" USING "type"::"text"::"public"."notification_preferences_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_preferences_type_enum_old" RENAME TO "notification_preferences_type_enum"`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "unique-page-and-type-and-channel" UNIQUE ("type", "channel", "page_id")`);
    }

}
