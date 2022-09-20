import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name',
    example: 'Timesheet',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Code',
    example: 'TS',
  })
  code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Department code',
    example: 'DEV001',
  })
  departmentCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Manager code',
    example: 'EMP001',
  })
  managerCode: string;
}
