import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCohostInvitation1760567859206 implements MigrationInterface {
    name = 'AddCohostInvitation1760567859206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cohost_invitations" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, "page_id" integer, CONSTRAINT "PK_7b870831cdd108b3ae693dc0cd4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "cohost_page_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_d203355f6b7a123668c06999425" FOREIGN KEY ("cohost_page_id") REFERENCES "pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cohost_invitations" ADD CONSTRAINT "FK_84e4788127651a8634c711473c7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cohost_invitations" ADD CONSTRAINT "FK_d4e65d7c5c488c8c8f469e869b7" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cohost_invitations" DROP CONSTRAINT "FK_d4e65d7c5c488c8c8f469e869b7"`);
        await queryRunner.query(`ALTER TABLE "cohost_invitations" DROP CONSTRAINT "FK_84e4788127651a8634c711473c7"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_d203355f6b7a123668c06999425"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "cohost_page_id"`);
        await queryRunner.query(`DROP TABLE "cohost_invitations"`);
    }

}
