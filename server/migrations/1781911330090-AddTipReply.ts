import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTipReply1781911330090 implements MigrationInterface {
    name = 'AddTipReply1781911330090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tip_replies" ("id" SERIAL NOT NULL, "message" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "tip_id" integer, CONSTRAINT "PK_59e1e7038ac6916c2c4b6016d8f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tip_replies" ADD CONSTRAINT "FK_5702e45a58c3d9a1a30bba29055" FOREIGN KEY ("tip_id") REFERENCES "tips"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tip_replies" DROP CONSTRAINT "FK_5702e45a58c3d9a1a30bba29055"`);
        await queryRunner.query(`DROP TABLE "tip_replies"`);
    }

}
