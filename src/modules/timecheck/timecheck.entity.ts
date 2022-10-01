import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'timechecks' })
export class Timecheck extends AbstractEntity {
  @Column({ name: 'user_code' })
  userCode: string;

  @Column({ name: 'user_name' })
  username: string;

  @Column({ name: 'check_date', type: 'date' })
  checkDate: Date;

  @Column({ name: 'check_in_time', type: 'time', nullable: true })
  checkInTime: string;

  @Column({ name: 'check_out_time', type: 'time', nullable: true })
  checkOutTime: string;

  @Column({ name: 'miss_check_in_min', type: 'int2', default: 0 })
  missCheckInMin: number;

  @Column({ name: 'miss_check_out_min', type: 'int2', default: 0 })
  missCheckOutMin: number;

  @Column({ name: 'miss_check_in', type: 'boolean', default: false })
  missCheckIn: boolean;

  @Column({ name: 'miss_check_out', type: 'boolean', default: false })
  missCheckOut: boolean;

  @Column({ name: 'is_leave_benefit', type: 'boolean', default: false })
  isLeaveBenefit: boolean;

  @Column({ name: 'leave_hour', type: 'float4', default: 0 })
  leaveHour: number;

  @Column({
    name: 'work_hour',
    type: 'numeric',
    precision: 3,
    scale: 1,
    default: 0,
  })
  workHour: number;

  @Column({ name: 'timezone', type: 'int2', default: 0 })
  timezone: number;
}
