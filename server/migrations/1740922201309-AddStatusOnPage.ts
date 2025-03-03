import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusOnPage1740922201309 implements MigrationInterface {
    name = 'AddStatusOnPage1740922201309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pages_status_enum" AS ENUM('active', 'deactive')`);
        await queryRunner.query(`ALTER TABLE "pages" ADD "status" "public"."pages_status_enum" NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."pages_status_enum"`);
    }

}
