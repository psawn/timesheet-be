import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApproverTypeEnum } from 'src/common/constants/approver.enum';
import { SubOrderUserDto } from 'src/modules/ot-management/ot-request-flow-approval/dto';

export class PolicyFlowApprovalDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Order',
    example: 1,
  })
  order: number;

  @IsNotEmpty()
  @IsEnum(ApproverTypeEnum)
  @ApiProperty({
    description: 'Approver type',
    example: ApproverTypeEnum.DEPARTMENT_MANAGER,
  })
  approverType: string;

  @IsNotEmpty()
  @IsArray()
  @Type(() => SubOrderUserDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    description: 'User',
    example: [
      {
        userCode: 'EMP001',
        subOrder: 1,
      },
      {
        userCode: 'EMP002',
        subOrder: 2,
      },
    ],
  })
  users: SubOrderUserDto[];

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'Next by one approve',
    example: true,
  })
  nextByOneApprove: boolean;
}
