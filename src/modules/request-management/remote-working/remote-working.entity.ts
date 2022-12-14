import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'remote-workings' })
export class RemoteWorking extends AbstractEntity {
  @Column({ name: 'user_code' })
  userCode: string;

  @Column({ name: 'work_date', type: 'date' })
  workDate: Date;

  @Column({ name: 'request_id', type: 'uuid', nullable: false })
  requestId: string;

  @Column({ name: 'approver_code' })
  approverCode: string;

  @Column({ name: 'check_in_time', type: 'time', nullable: true })
  checkInTime: string;

  @Column({ name: 'check_out_time', type: 'time', nullable: true })
  checkOutTime: string;

  @Column({ name: 'is_day_off', type: 'boolean', default: false })
  isDayOff: boolean;
}
