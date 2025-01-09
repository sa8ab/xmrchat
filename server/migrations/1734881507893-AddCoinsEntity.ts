import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCoinsEntity1734881507893 implements MigrationInterface {
    name = 'AddCoinsEntity1734881507893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "coins" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "ticker" character varying NOT NULL, "network" character varying NOT NULL, "image" character varying NOT NULL, "minimum" bigint NOT NULL, "maximum" bigint NOT NULL, CONSTRAINT "PK_af01e5dcef2c05e6385611205c6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "coins"`);
    }

}
