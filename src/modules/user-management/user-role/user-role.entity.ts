import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'user-role' })
export class UserRole extends AbstractEntity {
  @Column({ name: 'user_code' })
  userCode: string;

  @Column({ name: 'role_code' })
  roleCode: string;
}
