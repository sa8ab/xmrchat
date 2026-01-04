import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUrlOnPageVerification1767567567386 implements MigrationInterface {
    name = 'AddUrlOnPageVerification1767567567386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_verifications" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "page_verifications" ADD "verified_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_verifications" DROP COLUMN "verified_url"`);
        await queryRunner.query(`ALTER TABLE "page_verifications" DROP COLUMN "name"`);
    }

}
