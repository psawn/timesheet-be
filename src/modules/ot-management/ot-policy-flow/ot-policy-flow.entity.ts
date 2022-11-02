import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'ot-policy-flows' })
export class OtPolicyFlow extends AbstractEntity {
  @Column({ name: 'ot_policy_code', nullable: false })
  otPolicyCode: string;

  @Column({ name: 'department', nullable: true })
  department: string;

  @Column({ name: 'is_global_flow', default: false })
  isGlobalFlow: boolean;

  @Column({ name: 'flow_type', nullable: false })
  flowType: string;

  @Column({ name: 'approve_for_all', default: false })
  approveForAll: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;
}
