import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'request' })
export class TimeRequest extends AbstractEntity {
  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'reason', nullable: true })
  reason: string;

  @Column({ name: 'user_code', nullable: true })
  userCode: string;

  @Column({ name: 'policy_id', nullable: true })
  policyId: string;

  @Column({ name: 'configPolicy', type: 'jsonb', nullable: true })
  configPolicy: string;

  @Column({ name: 'configPolicyApprover', type: 'jsonb', nullable: true })
  configPolicyApprover: string;

  @Column({ name: 'expireTime', nullable: true, type: 'timestamptz' })
  expireTime: Date;
}
