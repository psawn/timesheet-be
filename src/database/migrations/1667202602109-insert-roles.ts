import { MigrationInterface, QueryRunner } from 'typeorm';
export class insertRoles1667202602109 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "roles"`);
    await queryRunner.query(
      `
      INSERT INTO public.roles("name", code) VALUES
      ('ADMIN','ADMIN'),
      ('EMP','EMP'),
      ('DER_MANAGER','DER_MANAGER'),
      ('DIR_MANAGER','DIR_MANAGER');
      `,
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "roles"`);
  }
}
