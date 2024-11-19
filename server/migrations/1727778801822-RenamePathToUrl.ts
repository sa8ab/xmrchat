import { MigrationInterface, QueryRunner } from "typeorm";

export class RenamePathToUrl1727778801822 implements MigrationInterface {
    name = 'RenamePathToUrl1727778801822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" RENAME COLUMN "path" TO "url"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" RENAME COLUMN "url" TO "path"`);
    }

}
