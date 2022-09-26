import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'general-worktime-settings' })
export class GeneralWorktimeSetting extends AbstractEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'code', unique: true })
  code: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;
}
