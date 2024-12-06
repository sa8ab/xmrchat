import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSearchTerm1733221470127 implements MigrationInterface {
    name = 'AddSearchTerm1733221470127'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ADD "search_terms" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "search_terms"`);
    }

}
