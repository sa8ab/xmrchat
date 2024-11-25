import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPageSettings1732530661878 implements MigrationInterface {
    name = 'AddPageSettings1732530661878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."page-settings_category_enum" AS ENUM('obs', 'streaming')`);
        await queryRunner.query(`CREATE TYPE "public"."page-settings_key_enum" AS ENUM('twitch-channel', 'obs-keep-messages', 'obs-play-sound')`);
        await queryRunner.query(`CREATE TYPE "public"."page-settings_type_enum" AS ENUM('string', 'number', 'boolean')`);
        await queryRunner.query(`CREATE TABLE "page-settings" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "category" "public"."page-settings_category_enum" NOT NULL, "key" "public"."page-settings_key_enum" NOT NULL, "type" "public"."page-settings_type_enum" NOT NULL, "value" text, CONSTRAINT "PK_58895a1494c4856c8d2f022f870" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "page-settings"`);
        await queryRunner.query(`DROP TYPE "public"."page-settings_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."page-settings_key_enum"`);
        await queryRunner.query(`DROP TYPE "public"."page-settings_category_enum"`);
    }

}
