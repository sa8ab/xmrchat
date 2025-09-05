import { MigrationInterface, QueryRunner } from "typeorm";

export class RecipientPercentageInteger1756297039060 implements MigrationInterface {
    name = 'RecipientPercentageInteger1756297039060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_recipients" DROP COLUMN "percentage"`);
        await queryRunner.query(`ALTER TABLE "page_recipients" ADD "percentage" integer DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_recipients" DROP COLUMN "percentage"`);
        await queryRunner.query(`ALTER TABLE "page_recipients" ADD "percentage" numeric(5,2) NOT NULL`);
    }

}
