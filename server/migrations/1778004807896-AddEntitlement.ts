import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEntitlement1778004807896 implements MigrationInterface {
    name = 'AddEntitlement1778004807896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "entitlements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "duration" integer, "amount" bigint NOT NULL, "type" character varying NOT NULL DEFAULT 'telegram', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "page_id" integer, CONSTRAINT "PK_6a45cb6f5747d49365a879bffde" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "entitlement_id" uuid`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "UQ_cd432d43ddddd1e37aae6a24bbf" UNIQUE ("entitlement_id")`);
        await queryRunner.query(`ALTER TABLE "entitlements" ADD CONSTRAINT "FK_ece4b9372d1c6eb59afabd61b64" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_cd432d43ddddd1e37aae6a24bbf" FOREIGN KEY ("entitlement_id") REFERENCES "entitlements"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_cd432d43ddddd1e37aae6a24bbf"`);
        await queryRunner.query(`ALTER TABLE "entitlements" DROP CONSTRAINT "FK_ece4b9372d1c6eb59afabd61b64"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "UQ_cd432d43ddddd1e37aae6a24bbf"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "entitlement_id"`);
        await queryRunner.query(`DROP TABLE "entitlements"`);
    }

}
