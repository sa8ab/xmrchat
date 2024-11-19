import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableTipMessage1729788589253 implements MigrationInterface {
    name = 'NullableTipMessage1729788589253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tips" ALTER COLUMN "message" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tips" ALTER COLUMN "message" SET NOT NULL`);
    }

}
