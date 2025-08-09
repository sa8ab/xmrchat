import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPageRecipients1754754805753 implements MigrationInterface {
    name = 'AddPageRecipients1754754805753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "page_recipients" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" character varying, "percentage" numeric(5,2) NOT NULL, "variant" character varying NOT NULL DEFAULT 'recipient', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "page_id" integer, CONSTRAINT "UQ_2d5b87e8f04ec48628ca088b756" UNIQUE ("page_id", "address"), CONSTRAINT "PK_87129331880ec711a6416ecc769" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "page_recipients" ADD CONSTRAINT "FK_e7f8a951ae33506e0b3ad7fb27a" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_recipients" DROP CONSTRAINT "FK_e7f8a951ae33506e0b3ad7fb27a"`);
        await queryRunner.query(`DROP TABLE "page_recipients"`);
    }

}
