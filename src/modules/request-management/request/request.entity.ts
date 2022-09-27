import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'request' })
export class TimeRequest extends AbstractEntity {
  @Column({ name: 'status', default: StatusRequestEnum.WAITING })
  status: string;

  @Column({ name: 'reason', nullable: true })
  reason: string;

  @Column({ name: 'user_code', nullable: true })
  userCode: string;

  @Column({ name: 'policy_code', nullable: true })
  policyCode: string;

  @Column({ name: 'configPolicy', type: 'jsonb', nullable: true })
  configPolicy: string;

  @Column({ name: 'expireTime', nullable: true, type: 'timestamp' })
  expireTime: Date;

  @Column({ name: 'approver_code', nullable: true })
  approverCode: string;

  @Column({ name: 'policy_type', nullable: true })
  policyType: string;

  @Column({ name: 'timezone', nullable: true })
  timezone: number;
}
