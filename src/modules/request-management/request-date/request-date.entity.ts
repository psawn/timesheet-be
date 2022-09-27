import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'request-dates' })
export class TimeRequestDate extends AbstractEntity {
  @Column({ name: 'date', type: 'date' })
  date: Date;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'request_id', nullable: false })
  requestId: string;
}
