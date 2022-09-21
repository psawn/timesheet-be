import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'project-user' })
export class ProjectUser extends AbstractEntity {
  @Column({ name: 'user_code', unique: true })
  userCode: string;

  @Column({ name: 'project_code', nullable: true })
  projectCode: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
