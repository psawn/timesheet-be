import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'general-worktimes' })
export class GeneralWorktime extends AbstractEntity {
  @Column({ name: 'day_of_week', type: 'int2' })
  dayOfWeek: number;

  @Column({ name: 'is_day_off', default: false })
  isDayOff: boolean;

  @Column({ name: 'work_time_code', nullable: true })
  workTimeCode: string;

  @Column({ name: 'check_in_time', type: 'time', nullable: true })
  checkInTime: string;

  @Column({ name: 'check_out_time', type: 'time', nullable: true })
  checkOutTime: string;
}
