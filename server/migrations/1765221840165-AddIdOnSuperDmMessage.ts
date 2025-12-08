import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIdOnSuperDmMessage1765221840165 implements MigrationInterface {
    name = 'AddIdOnSuperDmMessage1765221840165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "super_dm_messages" DROP CONSTRAINT "PK_420838a63a85b35577220cd41c1"`);
        await queryRunner.query(`ALTER TABLE "super_dm_messages" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "super_dm_messages" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "super_dm_messages" ADD CONSTRAINT "PK_420838a63a85b35577220cd41c1" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "super_dm_messages" DROP CONSTRAINT "PK_420838a63a85b35577220cd41c1"`);
        await queryRunner.query(`ALTER TABLE "super_dm_messages" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "super_dm_messages" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "super_dm_messages" ADD CONSTRAINT "PK_420838a63a85b35577220cd41c1" PRIMARY KEY ("id")`);
    }

}
