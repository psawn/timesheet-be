import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'request-approvers' })
export class RequestApprover extends AbstractEntity {
  @Column({ name: 'user_code', nullable: true })
  userCode: string;

  @Column({ name: 'request_id', type: 'uuid' })
  requestId: string;

  @Column({ name: 'status', default: StatusRequestEnum.WAITING })
  status: string;

  @Column({ name: 'order', type: 'int2' })
  order: number;

  @Column({ name: 'sub_order', type: 'int2', nullable: true })
  subOrder: number;

  @Column({ name: 'next_by_one_approve', default: false })
  nextByOneApprove: boolean;
}
