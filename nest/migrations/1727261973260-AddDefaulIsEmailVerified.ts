import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaulIsEmailVerified1727261973260 implements MigrationInterface {
    name = 'AddDefaulIsEmailVerified1727261973260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "is_email_verified" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "is_email_verified" DROP DEFAULT`);
    }

}
