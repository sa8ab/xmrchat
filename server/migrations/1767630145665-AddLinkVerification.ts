import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLinkVerification1767630145665 implements MigrationInterface {
    name = 'AddLinkVerification1767630145665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "page_verifications" ("id" SERIAL NOT NULL, "name" character varying, "type" character varying NOT NULL, "url" character varying, "verified_url" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "page_id" integer, CONSTRAINT "UQ_85468c33cb814093dfa1b7ad746" UNIQUE ("page_id", "type"), CONSTRAINT "PK_112c6ebadaa71d8fadb7726d910" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "link_verifications" ("id" SERIAL NOT NULL, "url" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "link_id" integer, CONSTRAINT "REL_d61da2efba2e339de071341168" UNIQUE ("link_id"), CONSTRAINT "PK_6cb18f5cdb11801b0fe2115dc84" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "page_verifications" ADD CONSTRAINT "FK_63b9ca25ea1e20de16ea5688ca5" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link_verifications" ADD CONSTRAINT "FK_d61da2efba2e339de071341168d" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_verifications" DROP CONSTRAINT "FK_d61da2efba2e339de071341168d"`);
        await queryRunner.query(`ALTER TABLE "page_verifications" DROP CONSTRAINT "FK_63b9ca25ea1e20de16ea5688ca5"`);
        await queryRunner.query(`DROP TABLE "link_verifications"`);
        await queryRunner.query(`DROP TABLE "page_verifications"`);
    }

}
