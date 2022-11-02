import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'ot-requests' })
export class OtRequest extends AbstractEntity {
  @Column({ name: 'status', default: StatusRequestEnum.WAITING })
  status: string;

  @Column({ name: 'reason', nullable: false })
  reason: string;

  @Column({ name: 'user_code', nullable: false })
  userCode: string;

  @Column({ name: 'project_code', nullable: false })
  projectCode: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @Column({ name: 'ot_plan_id', type: 'uuid' })
  otPlanId: string;

  @Column({ name: 'expire_time', nullable: true, type: 'timestamp' })
  expireTime: Date;

  @Column({ name: 'total_ot_hour', type: 'float4', default: 0 })
  totalOtHour: number;

  @Column({ name: 'ot_policy_code', nullable: false })
  otPolicyCode: string;

  @Column({ name: 'config_ot_policy', type: 'jsonb', nullable: true })
  configOtPolicy: string;

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
