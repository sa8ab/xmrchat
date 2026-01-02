import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPageVerification1767377109368 implements MigrationInterface {
    name = 'AddPageVerification1767377109368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "page_verifications" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "url" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "page_id" integer, CONSTRAINT "UQ_85468c33cb814093dfa1b7ad746" UNIQUE ("page_id", "type"), CONSTRAINT "PK_112c6ebadaa71d8fadb7726d910" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "page_verifications" ADD CONSTRAINT "FK_63b9ca25ea1e20de16ea5688ca5" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_verifications" DROP CONSTRAINT "FK_63b9ca25ea1e20de16ea5688ca5"`);
        await queryRunner.query(`DROP TABLE "page_verifications"`);
    }

}
