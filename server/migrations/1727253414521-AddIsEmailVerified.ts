import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsEmailVerified1727253414521 implements MigrationInterface {
    name = 'AddIsEmailVerified1727253414521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_email_verified" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_email_verified"`);
    }

}
