import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaidContentDescription1777661090022 implements MigrationInterface {
    name = 'AddPaidContentDescription1777661090022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paid_content" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paid_content" ALTER COLUMN "description" SET NOT NULL`);
    }

}
