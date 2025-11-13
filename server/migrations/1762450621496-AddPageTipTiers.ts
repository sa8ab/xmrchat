import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPageTipTiers1762450621496 implements MigrationInterface {
    name = 'AddPageTipTiers1762450621496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "page_tip_tiers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "min_amount" bigint, "max_amount" bigint, "color" character varying(7), "sound_id" integer, "page_id" integer, CONSTRAINT "PK_08c18bd052a433b6a8c829fa56b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "page_tip_tiers" ADD CONSTRAINT "FK_d1fca6ab2f9f6650a33c7be30fa" FOREIGN KEY ("sound_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "page_tip_tiers" ADD CONSTRAINT "FK_58285ffb43a3a2892a6d7b04179" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_tip_tiers" DROP CONSTRAINT "FK_58285ffb43a3a2892a6d7b04179"`);
        await queryRunner.query(`ALTER TABLE "page_tip_tiers" DROP CONSTRAINT "FK_d1fca6ab2f9f6650a33c7be30fa"`);
        await queryRunner.query(`DROP TABLE "page_tip_tiers"`);
    }

}
