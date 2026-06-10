import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBioOnPage1781127047780 implements MigrationInterface {
    name = 'AddBioOnPage1781127047780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ADD "bio" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "bio"`);
    }

}
