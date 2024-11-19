import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFile1727523313538 implements MigrationInterface {
  name = 'AddFile1727523313538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."files_type_enum" AS ENUM('page-logo')`,
    );
    await queryRunner.query(
      `CREATE TABLE "files" ("id" SERIAL PRIMARY KEY, "filename" VARCHAR NOT NULL, "type" "public"."files_type_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TYPE "public"."files_type_enum"`);
  }
}
