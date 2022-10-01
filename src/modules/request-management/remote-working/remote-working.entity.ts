import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'remote-workings' })
export class RemoteWorking extends AbstractEntity {
  @Column({ name: 'user_code' })
  userCode: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'request_id', type: 'uuid', nullable: false })
  requestId: string;

  @Column({ name: 'approver_code' })
  approverCode: string;
}
