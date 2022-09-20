import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'roles' })
export class Role extends AbstractEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'code' })
  code: string;
}
