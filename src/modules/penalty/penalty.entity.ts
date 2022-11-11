import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'penalty' })
export class Penalty extends AbstractEntity {
  @Column({ name: 'user_code', nullable: false })
  userCode: string;

  @Column({ name: 'type', nullable: false })
  type: string;

  @Column({ name: 'penalty_unit', nullable: false })
  penaltyUnit: string;

  @Column({ name: 'date', type: 'date', nullable: false })
  date: Date;
}
