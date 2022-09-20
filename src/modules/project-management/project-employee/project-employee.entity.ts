import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'project-user' })
export class ProjectEmployee extends AbstractEntity {
  @Column({ name: 'user_code', unique: true })
  code: string;

  @Column({ name: 'project_code', nullable: true })
  departmentCode: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;
}
