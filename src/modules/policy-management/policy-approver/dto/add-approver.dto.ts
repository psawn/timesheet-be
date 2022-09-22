import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApproverTypeEnum } from 'src/common/constants/approver.enum';

export class AddApproverDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Policy code',
    example: 'MISS_IN_001',
  })
  policyCode: string;

  @IsNotEmpty()
  @IsEnum(ApproverTypeEnum)
  @ApiProperty({
    description: 'Approver type',
    enum: ApproverTypeEnum,
    example: ApproverTypeEnum.DEPARTMENT_MANAGER,
  })
  approverType: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Approver code',
    example: 'EMP001',
  })
  approverCode: string;

  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    description: 'Department codes',
    example: ['DEV001', 'DEV002'],
  })
  departmentCodes: string[];
}
