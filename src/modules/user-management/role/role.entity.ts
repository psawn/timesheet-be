import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'roles' })
export class Role extends AbstractEntity {
  @Column({ name: 'user_code' })
  userCode: string;

  @Column({ name: 'role_code' })
  roleCode: string;
}
