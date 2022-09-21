import { MigrationInterface, QueryRunner } from 'typeorm';
export class insertDataPolicyTypes1663759080636 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "policy-types"`);
    await queryRunner.query(
      `
        INSERT INTO public."policy-types" (id,created_at,updated_at,name,code) VALUES
        ('e3dc8321-8792-4809-b544-7a7f231a3e18','2022-09-21 18:20:22.623834','2022-09-21 18:20:22.623834','Missing check in','MISSING_IN'),
        ('4a997ae7-d099-4ab1-801e-f981d6e0cf35','2022-09-21 18:20:44.771272','2022-09-21 18:20:44.771272','Missing check out','MISSING_OUT');
      `,
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "policy-types"`);
  }
}
