import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVideoIdAndDataOnLiveStream1758987325503 implements MigrationInterface {
    name = 'AddVideoIdAndDataOnLiveStream1758987325503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "live_streams" ADD "video_id" character varying`);
        await queryRunner.query(`ALTER TABLE "live_streams" ADD "data" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "live_streams" DROP COLUMN "data"`);
        await queryRunner.query(`ALTER TABLE "live_streams" DROP COLUMN "video_id"`);
    }

}
