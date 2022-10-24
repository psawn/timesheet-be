import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ApproverTypeEnum } from 'src/common/constants/approver.enum';
import { RequestFlowEnum } from 'src/common/constants/request-flow.enum';
import { OtRequestFlowApprovalDto } from '../../ot-request-flow-approval/dto';

export class CreateOtRequestFlow {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Departments',
    example: ['DEP001', 'DEP002'],
  })
  departmentCodes: string[];

  @IsNotEmpty()
  @IsEnum(RequestFlowEnum)
  @ApiProperty({
    description: 'Departments',
    example: RequestFlowEnum.PARALLEL,
  })
  flowType: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'Approve for all',
    example: false,
  })
  approveForAll: boolean;

  @ArrayNotEmpty()
  @IsArray()
  @Type(() => OtRequestFlowApprovalDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    description: 'Ot request date',
    example: [
      {
        order: 1,
        approverType: ApproverTypeEnum.DEPARTMENT_MANAGER,
        users: [],
        nextByOneApprove: false,
      },
      {
        order: 2,
        approverType: ApproverTypeEnum.DIRECT_MANAGER,
        users: [],
        nextByOneApprove: false,
      },
      {
        order: 3,
        approverType: ApproverTypeEnum.SPECIFIC_PERSON,
        users: [
          {
            userCode: 'EMP001',
            subOrder: 1,
          },
          {
            userCode: 'EMP002',
            subOrder: 2,
          },
        ],
        nextByOneApprove: false,
      },
    ],
  })
  otRequestFlowApprovals: OtRequestFlowApprovalDto[];
}
