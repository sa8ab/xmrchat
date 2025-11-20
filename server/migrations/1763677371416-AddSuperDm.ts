import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSuperDm1763677371416 implements MigrationInterface {
    name = 'AddSuperDm1763677371416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "super_dms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "public_key" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "page_id" integer, CONSTRAINT "PK_55dda12378b16cfe9725ad52909" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "super_dm_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "super_dm_id" uuid NOT NULL, CONSTRAINT "PK_420838a63a85b35577220cd41c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "super_dms" ADD CONSTRAINT "FK_b3b517c178e2ddc86c3b3a8e4f5" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "super_dm_messages" ADD CONSTRAINT "FK_f3e2f34940e321c59e8d0e18e0c" FOREIGN KEY ("super_dm_id") REFERENCES "super_dms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "super_dm_messages" DROP CONSTRAINT "FK_f3e2f34940e321c59e8d0e18e0c"`);
        await queryRunner.query(`ALTER TABLE "super_dms" DROP CONSTRAINT "FK_b3b517c178e2ddc86c3b3a8e4f5"`);
        await queryRunner.query(`DROP TABLE "super_dm_messages"`);
        await queryRunner.query(`DROP TABLE "super_dms"`);
    }

}
