import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'request-dates' })
export class TimeRequestDate extends AbstractEntity {
  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'request_id', type: 'uuid', nullable: false })
  requestId: string;

  @Column({ name: 'user_code', nullable: true })
  userCode: string;
}
