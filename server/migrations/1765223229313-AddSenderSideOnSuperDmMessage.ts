import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSenderSideOnSuperDmMessage1765223229313 implements MigrationInterface {
    name = 'AddSenderSideOnSuperDmMessage1765223229313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "super_dm_messages" ADD "sender_type" character varying NOT NULL DEFAULT 'creator'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "super_dm_messages" DROP COLUMN "sender_type"`);
    }

}
