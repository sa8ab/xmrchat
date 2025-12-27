import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSuperDmToSwap1764698561331 implements MigrationInterface {
    name = 'AddSuperDmToSwap1764698561331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap" ADD "super_dm_id" uuid`);
        await queryRunner.query(`ALTER TABLE "swap" ADD CONSTRAINT "UQ_182c776b97688ee9f8eb51f10b5" UNIQUE ("super_dm_id")`);
        await queryRunner.query(`ALTER TABLE "swap" ADD CONSTRAINT "FK_182c776b97688ee9f8eb51f10b5" FOREIGN KEY ("super_dm_id") REFERENCES "super_dms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap" DROP CONSTRAINT "FK_182c776b97688ee9f8eb51f10b5"`);
        await queryRunner.query(`ALTER TABLE "swap" DROP CONSTRAINT "UQ_182c776b97688ee9f8eb51f10b5"`);
        await queryRunner.query(`ALTER TABLE "swap" DROP COLUMN "super_dm_id"`);
    }

}
