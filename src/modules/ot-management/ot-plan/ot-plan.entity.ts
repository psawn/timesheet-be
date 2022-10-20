import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'ot-plans' })
export class OtPlan extends AbstractEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'project_code', nullable: false })
  projectCode: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'reason', nullable: true })
  reason: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'status', default: StatusRequestEnum.WAITING })
  status: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
