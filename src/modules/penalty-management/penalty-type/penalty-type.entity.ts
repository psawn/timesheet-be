import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { PenaltyGroupEnum } from 'src/common/constants/penalty-group.enum';
import { PenaltyTypeEnum } from 'src/common/constants/penalty-type.enum';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'penalty-types' })
export class PenaltyType extends AbstractEntity {
  @Column({ name: 'code', unique: true })
  code: string;

  @Column({ name: 'unit', type: 'int2' })
  unit: number;

  @Column({ name: 'reason', nullable: true })
  reason: string;

  @Column({
    name: 'type',
    enum: PenaltyTypeEnum,
    type: 'enum',
    enumName: 'PenaltyTypeEnum',
    default: PenaltyTypeEnum.DAY,
  })
  type: PenaltyTypeEnum;

  @Column({
    name: 'group',
    enum: PenaltyGroupEnum,
    type: 'enum',
    enumName: 'PenaltyGroupEnum',
  })
  group: PenaltyGroupEnum;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;
}
