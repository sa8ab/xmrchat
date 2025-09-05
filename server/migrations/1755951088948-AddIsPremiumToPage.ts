import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsPremiumToPage1755951088948 implements MigrationInterface {
    name = 'AddIsPremiumToPage1755951088948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ADD "is_premium" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "is_premium"`);
    }

}
