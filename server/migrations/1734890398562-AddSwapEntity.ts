import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSwapEntity1734890398562 implements MigrationInterface {
    name = 'AddSwapEntity1734890398562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "swap" ("id" SERIAL NOT NULL, "platform" character varying NOT NULL DEFAULT 'trocador', "swap_id" character varying NOT NULL, "input_amount" character varying(32) NOT NULL, "swap_address" character varying NOT NULL, "status" character varying NOT NULL, "context" jsonb NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "coin_id" integer, "tip_id" integer, CONSTRAINT "REL_8f374681e36a2ee84e5fcfbe73" UNIQUE ("coin_id"), CONSTRAINT "REL_8d02948760cbb90c3635578026" UNIQUE ("tip_id"), CONSTRAINT "PK_4a10d0f359339acef77e7f986d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "swap" ADD CONSTRAINT "swap_coin_id_fkey" FOREIGN KEY ("coin_id") REFERENCES "coins"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "swap" ADD CONSTRAINT "swap_tip_id_fkey" FOREIGN KEY ("tip_id") REFERENCES "tips"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap" DROP CONSTRAINT "swap_tip_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "swap" DROP CONSTRAINT "swap_coin_id_fkey"`);
        await queryRunner.query(`DROP TABLE "swap"`);
    }

}
