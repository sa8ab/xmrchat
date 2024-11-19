import { MigrationInterface, QueryRunner } from "typeorm";

export class MakePageTwtichChannelOptional1727960880297 implements MigrationInterface {
    name = 'MakePageTwtichChannelOptional1727960880297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "twitch_channel" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "is_public" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "is_public" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "twitch_channel" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "description" SET NOT NULL`);
    }

}
