import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'penalties' })
export class Penalty extends AbstractEntity {
  @Column({ name: 'user_code' })
  name: string;

  @Column({ name: 'penalty_type_code' })
  penaltyTypeCode: string;

  @Column({ name: 'date', type: 'date' })
  date: Date;

  @Column({ name: 'reason', nullable: true })
  reason: string;

  @Column({ name: 'unit', type: 'int2' })
  unit: string;
}
