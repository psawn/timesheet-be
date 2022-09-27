import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'leave-benefits' })
export class LeaveBenefit extends AbstractEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'code', unique: true })
  code: string;

  @Column({ name: 'standard_leave', type: 'float4', default: 0 })
  standardLeave: number;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
