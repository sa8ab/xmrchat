import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTiers1728642524122 implements MigrationInterface {
    name = 'AddTiers1728642524122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tiers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "amount" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "page_id" integer, CONSTRAINT "PK_908405492b9b2c2ae1cea1e1cc0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tiers" ADD CONSTRAINT "tiers_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tiers" DROP CONSTRAINT "tiers_page_id_fkey"`);
        await queryRunner.query(`DROP TABLE "tiers"`);
    }

}
