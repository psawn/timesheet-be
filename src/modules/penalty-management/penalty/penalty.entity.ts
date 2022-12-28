import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'penalties' })
export class Penalty extends AbstractEntity {
  @Column({ name: 'user_code' })
  userCode: string;

  @Column({ name: 'penalty_type_code' })
  penaltyTypeCode: string;

  @Column({ name: 'penalty_type_group' })
  penaltyTypeGroup: string;

  @Column({ name: 'date', type: 'date' })
  date: Date;
}
