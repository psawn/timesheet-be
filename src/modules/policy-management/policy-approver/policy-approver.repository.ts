import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { AddApproverDto } from './dto';
import { PolicyApproves } from './policy-approver.entity';

@Injectable()
export class PolicyApproverRepository extends TypeORMRepository<PolicyApproves> {
  constructor(manager: EntityManager) {
    super(PolicyApproves, manager);
  }

  // async addApprover(addApproverDto: AddApproverDto) {
  //   const { policyCode } = addApproverDto;
  //   const data = [];
  //   addApproverDto.departmentCodes.map((departmentCode) => {
  //     data.push({
  //       policyCode,
  //       departmentCode,
  //     });
  //   });
  //   // const data = addApproverDto.departmentCodes.map((item) => {
  //   //   return {
  //   //     ...item,
  //   //   };
  //   // });
  // }
}
