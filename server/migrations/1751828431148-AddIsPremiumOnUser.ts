import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsPremiumOnUser1751828431148 implements MigrationInterface {
    name = 'AddIsPremiumOnUser1751828431148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_premium" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_premium"`);
    }

}
