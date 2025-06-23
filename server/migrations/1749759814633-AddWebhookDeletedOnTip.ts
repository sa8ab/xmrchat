import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWebhookDeletedOnTip1749759814633 implements MigrationInterface {
    name = 'AddWebhookDeletedOnTip1749759814633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tips" ADD "webhook_deleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tips" DROP COLUMN "webhook_deleted"`);
    }

}
