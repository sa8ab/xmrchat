import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableRecipientName1756393708811 implements MigrationInterface {
    name = 'NullableRecipientName1756393708811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_recipients" ALTER COLUMN "name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_recipients" ALTER COLUMN "name" SET NOT NULL`);
    }

}
