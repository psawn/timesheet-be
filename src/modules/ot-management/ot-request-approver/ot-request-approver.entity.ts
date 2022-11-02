import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'ot-request-approvers' })
export class OtRequestApprover extends AbstractEntity {
  @Column({ name: 'user_code', nullable: true })
  userCode: string;

  @Column({ name: 'ot_request_id', type: 'uuid' })
  otRequestId: string;

  @Column({ name: 'status', default: StatusRequestEnum.WAITING })
  status: string;

  @Column({ name: 'order', type: 'int2' })
  order: number;

  @Column({ name: 'sub_order', type: 'int2', nullable: true })
  subOrder: number;

  @Column({ name: 'next_by_one_approve', default: false })
  nextByOneApprove: boolean;

  @Column({ name: 'approver_type' })
  approverType: string;
}
