import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPage1727538041183 implements MigrationInterface {
  name = 'AddPage1727538041183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pages" (
      "id" SERIAL PRIMARY KEY, 
      "path" VARCHAR NOT NULL, 
      "name" VARCHAR NOT NULL, 
      "description" VARCHAR NOT NULL, 
      "primary_address" VARCHAR NOT NULL, 
      "secret_view_key" VARCHAR NOT NULL, 
      "twitch_channel" VARCHAR NOT NULL, 
      "is_public" boolean NOT NULL,
      "banner_id" integer REFERENCES files(id), 
      "logo_id" integer REFERENCES files(id),
      "user_id" integer REFERENCES users(id),
        UNIQUE ("path"), 
        UNIQUE ("banner_id"), 
        UNIQUE ("logo_id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "pages"`);
  }
}
