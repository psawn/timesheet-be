import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'user-leave-benefit' })
export class UserLeaveBenefit extends AbstractEntity {
  @Column({ name: 'user_code' })
  userCode: string;

  @Column({ name: 'used_day', type: 'float4', default: 0 })
  usedDay: number;

  @Column({ name: 'remaining_day', type: 'float4', default: 0 })
  remainingDay: number;

  @Column({ name: 'year', type: 'int2' })
  year: number;
}
