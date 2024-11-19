import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTokens1727332862647 implements MigrationInterface {
  name = 'AddUserTokens1727332862647';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user-tokens_type_enum" AS ENUM('email-verification', 'reset-password')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user-tokens" ("id" SERIAL PRIMARY KEY, "token" VARCHAR NOT NULL, "type" "public"."user-tokens_type_enum" NOT NULL, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now())`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user-tokens"`);
    await queryRunner.query(`DROP TYPE "public"."user-tokens_type_enum"`);
  }
}
