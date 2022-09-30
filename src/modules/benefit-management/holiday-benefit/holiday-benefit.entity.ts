import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'holiday-benefits' })
export class HolidayBenfit extends AbstractEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'is_annual', type: 'boolean', default: false })
  isAnnual: boolean;

  @Column({ name: 'paid', type: 'boolean', default: false })
  paid: boolean;

  @Column({ name: 'ot_point', type: 'float4', default: 1 })
  otPoint: number;
}
