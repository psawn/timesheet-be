import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'ot-request-dates' })
export class OtRequestDate extends AbstractEntity {
  @Column({ name: 'ot_request_id', type: 'uuid' })
  otRequestId: string;

  @Column({ name: 'ot_hour', type: 'float4', default: 0 })
  otHour: number;

  @Column({ name: 'date', type: 'date' })
  date: Date;

  @Column({ name: 'user_code', nullable: true })
  userCode: string;
}
