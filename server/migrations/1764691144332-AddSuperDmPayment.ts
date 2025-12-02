import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSuperDmPayment1764691144332 implements MigrationInterface {
    name = 'AddSuperDmPayment1764691144332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ADD "super_dm_id" uuid`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "UQ_c0792496d82896d0a9292d2240d" UNIQUE ("super_dm_id")`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_c0792496d82896d0a9292d2240d" FOREIGN KEY ("super_dm_id") REFERENCES "super_dms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_c0792496d82896d0a9292d2240d"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "UQ_c0792496d82896d0a9292d2240d"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "super_dm_id"`);
    }

}
