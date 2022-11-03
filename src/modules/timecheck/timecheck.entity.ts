import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column, Unique } from 'typeorm';

@Unique(['checkDate', 'userCode'])
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
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return +value;
        // convert to number, numeric is a string
      },
    },
  })
  workHour: number;

  @Column({ name: 'timezone', type: 'int2', default: 0 })
  timezone: number;

  @Column({ name: 'is_day_off', type: 'boolean', default: false })
  isDayOff: boolean;

  @Column({
    name: 'ot_work_hour',
    type: 'numeric',
    precision: 3,
    scale: 1,
    default: 0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return +value;
      },
    },
  })
  otWorkHour: number;
}
