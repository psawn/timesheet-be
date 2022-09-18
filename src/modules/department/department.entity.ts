import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'departments' })
export class Department extends AbstractEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'code', unique: true })
  code: string;

  @Column({ name: 'manager', nullable: true })
  manager: string;
}
