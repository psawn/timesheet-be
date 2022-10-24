import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'ot-requests' })
export class OtRequest extends AbstractEntity {
  @Column({ name: 'project_code', nullable: false })
  projectCode: string;

  @Column({ name: 'reason', nullable: false })
  reason: string;

  @Column({ name: 'status', default: StatusRequestEnum.WAITING })
  status: string;

  @Column({ name: 'user_code', nullable: false })
  userCode: string;

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
}
