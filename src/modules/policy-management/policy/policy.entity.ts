import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'policies' })
export class Policy extends AbstractEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'code', unique: true })
  code: string;

  @Column({ name: 'type_code', nullable: true })
  typeCode: string;

  @Column({ name: 'group', nullable: true })
  group: string;

  @Column({ name: 'max_days_process', type: 'float4', nullable: true })
  maxDaysProcess: number;

  @Column({ name: 'use_annual_leave', nullable: true })
  useAnnualLeave: boolean;

  @Column({ name: 'work_day', type: 'float', nullable: true })
  workDay: number;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
