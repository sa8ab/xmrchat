import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMessageLengthOnTier1769632993266 implements MigrationInterface {
    name = 'AddMessageLengthOnTier1769632993266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_tip_tiers" ADD "message_length" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_tip_tiers" DROP COLUMN "message_length"`);
    }

}
