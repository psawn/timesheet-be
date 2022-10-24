import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'ot-request-flow-approvals' })
export class OtRequestFlowApproval extends AbstractEntity {
  @Column({ name: 'ot_request_flow_id', type: 'uuid' })
  otRequestFlowId: string;

  @Column({ name: 'user_code', nullable: true })
  userCode: string;

  @Column({ name: 'approver_type', nullable: true })
  approverType: string;

  @Column({ name: 'order', type: 'int2' })
  order: number;

  @Column({ name: 'sub_order', type: 'int2', nullable: true })
  subOrder: number;

  @Column({ name: 'next_by_one_approve', default: false })
  nextByOneApprove: boolean;
}
