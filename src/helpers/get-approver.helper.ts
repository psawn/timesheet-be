import { get, pick } from 'lodash';
import { ApproverTypeEnum } from 'src/common/constants/approver.enum';
import { Policy } from 'src/modules/policy-management/policy/policy.entity';

export const getApprover = (policy: Policy) => {
  if (policy['approver'].approverType == ApproverTypeEnum.SPECIFIC_PERSON) {
    return pick(get(policy, 'approver.specificPerson'), [
      'id',
      'code',
      'name',
      'email',
    ]);
  }

  if (policy['approver'].approverType == ApproverTypeEnum.DIRECT_MANAGER) {
    return pick(get(policy, 'approver.directManager'), [
      'id',
      'code',
      'name',
      'email',
    ]);
  }

  return pick(get(policy, 'approver.department.departmentManager'), [
    'id',
    'code',
    'name',
    'email',
  ]);
};
