import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveIsPremiumFromUser1757185998250 implements MigrationInterface {
    name = 'RemoveIsPremiumFromUser1757185998250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_premium"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_premium" boolean NOT NULL DEFAULT false`);
    }

}
