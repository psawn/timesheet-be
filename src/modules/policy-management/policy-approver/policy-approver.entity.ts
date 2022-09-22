import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'policy-approvers' })
export class PolicyApproves extends AbstractEntity {
  @Column({ name: 'policy_code', nullable: true })
  policyCode: string;

  @Column({ name: 'approver_type', nullable: true })
  approverType: string;

  @Column({ name: 'approver_code', nullable: true })
  approverCode: string;

  @Column({ name: 'department_code', nullable: true })
  departmentCode: string;
}
