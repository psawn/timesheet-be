import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PolicyGroup } from 'src/common/constants/policy-group.enum';

export class UpdatePolicyDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Name',
    example: 'Missing check in',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Type code',
    example: 'MISSING_IN',
  })
  typeCode: string;

  @IsEnum(PolicyGroup)
  @ApiProperty({
    description: 'Group',
    example: PolicyGroup.OTHER,
    enum: PolicyGroup,
  })
  group: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: 'Max days process',
    example: 3.5,
  })
  maxDaysProcess: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Use annaul leave',
    example: true,
  })
  useAnnualLeave: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @ApiProperty({
    description: 'Number of minus work day',
    example: 0.5,
  })
  workDay: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Is active',
    example: false,
  })
  isActive: boolean;
}
