import { MigrationInterface, QueryRunner } from "typeorm";

export class AddThumbnailToFile1733412535776 implements MigrationInterface {
    name = 'AddThumbnailToFile1733412535776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" ADD "thumbnail" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "thumbnail"`);
    }

}
