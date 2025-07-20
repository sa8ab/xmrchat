import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLanguageOnUser1753050501186 implements MigrationInterface {
    name = 'AddLanguageOnUser1753050501186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "language" character varying(2) NOT NULL DEFAULT 'en'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "language"`);
    }

}
