import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCoverImage1727538926531 implements MigrationInterface {
    name = 'UpdateCoverImage1727538926531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP CONSTRAINT "pages_banner_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "pages" RENAME COLUMN "banner_id" TO "cover_image_id"`);
        await queryRunner.query(`ALTER TABLE "pages" ADD CONSTRAINT "pages_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP CONSTRAINT "pages_cover_image_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "pages" RENAME COLUMN "cover_image_id" TO "banner_id"`);
        await queryRunner.query(`ALTER TABLE "pages" ADD CONSTRAINT "pages_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
