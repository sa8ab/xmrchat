import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOriginalName1727528375877 implements MigrationInterface {
  name = 'AddOriginalName1727528375877';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" ADD "original_name" VARCHAR NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "original_name"`);
  }
}
