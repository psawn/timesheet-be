import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePolicyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name',
    example: 'Missing check in',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Code',
    example: 'MISS_IN_001',
  })
  code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Type code',
    example: 'MISSING_IN',
  })
  typeCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Group',
    example: 'ABSENCE',
  })
  group: string;

  @IsOptional()
  @IsNumber()
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
}
