import { MigrationInterface, QueryRunner } from "typeorm";

export class SwapAndCoinManyToOne1734988473934 implements MigrationInterface {
    name = 'SwapAndCoinManyToOne1734988473934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap" DROP CONSTRAINT "swap_coin_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "swap" DROP CONSTRAINT "REL_8f374681e36a2ee84e5fcfbe73"`);
        await queryRunner.query(`ALTER TABLE "swap" ADD CONSTRAINT "FK_8f374681e36a2ee84e5fcfbe73c" FOREIGN KEY ("coin_id") REFERENCES "coins"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap" DROP CONSTRAINT "FK_8f374681e36a2ee84e5fcfbe73c"`);
        await queryRunner.query(`ALTER TABLE "swap" ADD CONSTRAINT "REL_8f374681e36a2ee84e5fcfbe73" UNIQUE ("coin_id")`);
        await queryRunner.query(`ALTER TABLE "swap" ADD CONSTRAINT "swap_coin_id_fkey" FOREIGN KEY ("coin_id") REFERENCES "coins"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
