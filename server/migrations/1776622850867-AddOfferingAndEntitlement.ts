import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOfferingAndEntitlement1776622850867 implements MigrationInterface {
    name = 'AddOfferingAndEntitlement1776622850867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "offerings" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "duration" integer, "amount" bigint NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "page_id" integer, CONSTRAINT "PK_6d6a2d4bc88776139fc71a60ca6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "entitlements" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "duration" integer, "amount" bigint NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "offering_id" integer, CONSTRAINT "PK_6a45cb6f5747d49365a879bffde" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "offerings" ADD CONSTRAINT "FK_18f307316d70c65ae919300ce23" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "entitlements" ADD CONSTRAINT "FK_3239d91f4f69c57081092155c16" FOREIGN KEY ("offering_id") REFERENCES "offerings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entitlements" DROP CONSTRAINT "FK_3239d91f4f69c57081092155c16"`);
        await queryRunner.query(`ALTER TABLE "offerings" DROP CONSTRAINT "FK_18f307316d70c65ae919300ce23"`);
        await queryRunner.query(`DROP TABLE "entitlements"`);
        await queryRunner.query(`DROP TABLE "offerings"`);
    }

}
