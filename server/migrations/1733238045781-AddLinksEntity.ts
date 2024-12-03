import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLinksEntity1733238045781 implements MigrationInterface {
    name = 'AddLinksEntity1733238045781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "links" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "platform" character varying NOT NULL, "value" character varying NOT NULL, "page_id" integer, CONSTRAINT "unique-page-and-platform" UNIQUE ("page_id", "platform"), CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "FK_14718c03858a78ca7ac59b428d0" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_14718c03858a78ca7ac59b428d0"`);
        await queryRunner.query(`DROP TABLE "links"`);
    }

}
