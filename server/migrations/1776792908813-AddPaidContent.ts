import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaidContent1776792908813 implements MigrationInterface {
    name = 'AddPaidContent1776792908813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "paid_content" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "duration" integer, "amount" bigint NOT NULL, "type" character varying NOT NULL DEFAULT 'telegram', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "page_id" integer, CONSTRAINT "PK_095946d65b3cb26bc655af9dd70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "paid_content" ADD CONSTRAINT "FK_abda25ec3d2f160d34b0f187b2b" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paid_content" DROP CONSTRAINT "FK_abda25ec3d2f160d34b0f187b2b"`);
        await queryRunner.query(`DROP TABLE "paid_content"`);
    }

}
