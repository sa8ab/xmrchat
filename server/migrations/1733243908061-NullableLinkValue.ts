import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableLinkValue1733243908061 implements MigrationInterface {
    name = 'NullableLinkValue1733243908061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "value" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "value" SET NOT NULL`);
    }

}
