import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtToPage1729791293679 implements MigrationInterface {
    name = 'AddCreatedAtToPage1729791293679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ADD "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "created_at"`);
    }

}
