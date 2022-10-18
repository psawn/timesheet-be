import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'timelogs' })
export class Timelog extends AbstractEntity {
  @Column({ name: 'user_code', nullable: false })
  userCode: string;

  @Column({ name: 'project_code', nullable: false })
  projectCode: string;

  @Column({ name: 'log_hour', type: 'float4', default: 0 })
  logHour: number;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'check_date', type: 'date' })
  checkDate: Date;
}
