import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLiveStream1758653415624 implements MigrationInterface {
    name = 'AddLiveStream1758653415624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "live_streams" ("id" SERIAL NOT NULL, "platform" character varying NOT NULL, "title" character varying, "description" character varying, "image_url" character varying, "channel_id" character varying, "channel_name" character varying, "viewer_count" integer, "started_at" TIMESTAMP WITH TIME ZONE, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "page_id" integer, CONSTRAINT "PK_33ffe1dff05e56f4381fe715c6d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "live_streams" ADD CONSTRAINT "FK_9728e57c0d15745eae671063099" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "live_streams" DROP CONSTRAINT "FK_9728e57c0d15745eae671063099"`);
        await queryRunner.query(`DROP TABLE "live_streams"`);
    }

}
