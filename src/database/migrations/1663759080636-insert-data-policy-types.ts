import { MigrationInterface, QueryRunner } from 'typeorm';
export class insertDataPolicyTypes1663759080636 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "policy-types"`);
    await queryRunner.query(
      `
      INSERT INTO public."policy-types" (id,created_at,updated_at,name,code) VALUES
      ('e3dc8321-8792-4809-b544-7a7f231a3e18','2022-09-21 18:20:22.623834','2022-09-21 18:20:22.623834','Missing check in','MISSING_IN'),
      ('4a997ae7-d099-4ab1-801e-f981d6e0cf35','2022-09-21 18:20:44.771272','2022-09-21 18:20:44.771272','Missing check out','MISSING_OUT'),
      ('f2e3af95-870f-45cf-b991-ca417918b116','2022-09-29 03:49:45.896258','2022-09-29 03:49:45.896258','Morning absence','MORNING_ABSENT'),
      ('99ecb061-e7bb-4089-9b7c-569d106a0004','2022-09-29 03:50:07.389018','2022-09-29 03:50:07.389018','Afternoon absence','AFTERNOON_ABSENT'),
      ('56ff91e9-3e50-4300-b3f1-ce043cdd8220','2022-09-29 03:49:32.595929','2022-09-29 03:49:32.595929','Full day absence','FULL_DAY_ABSENT'),
      ('d43ea6b7-6490-4f76-a6b4-a63ef38bbc22','2022-10-03 17:55:39.582727','2022-10-03 17:55:39.582727','Remote working','REMOTE_WORKING');
   
      `,
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "policy-types"`);
  }
}
