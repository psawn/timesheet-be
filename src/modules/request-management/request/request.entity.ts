import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'requests' })
export class TimeRequest extends AbstractEntity {
  @Column({ name: 'status', default: StatusRequestEnum.WAITING })
  status: string;

  @Column({ name: 'reason', nullable: true })
  reason: string;

  @Column({ name: 'user_code', nullable: true })
  userCode: string;

  @Column({ name: 'policy_code', nullable: true })
  policyCode: string;

  @Column({ name: 'config_policy', type: 'jsonb', nullable: true })
  configPolicy: string;

  @Column({ name: 'expire_time', nullable: true, type: 'timestamp' })
  expireTime: Date;

  @Column({ name: 'policy_type', nullable: true })
  policyType: string;

  @Column({ name: 'timezone', nullable: true })
  timezone: number;

  @Column({ name: 'total_date', type: 'float4', default: 0 })
  totalDate: number;

  @Column({ name: 'order', type: 'int2' })
  order: number;

  @Column({ name: 'sub_order', type: 'int2', nullable: true })
  subOrder: number;

  @Column({ name: 'flow_type', nullable: false })
  flowType: string;

  @Column({ name: 'setting_approver', type: 'jsonb', nullable: false })
  settingApprover: any[];
}
