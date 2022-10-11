import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Phone',
    example: '0972055909',
    required: false,
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Leave benefit code',
    example: 'EMP',
    required: false,
  })
  leaveBenefitCode: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Worktime code',
    example: 'WT',
    required: false,
  })
  worktimeCode: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Department',
    example: 'DEV-SAV',
    required: false,
  })
  department: string;
}
