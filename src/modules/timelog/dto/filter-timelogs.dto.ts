import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FilterMyTimelogsDto } from './filter-my-timelogs.dto';

export class FilterTimelogsDto extends FilterMyTimelogsDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User code',
    example: 'EMP001',
    required: false,
  })
  userCode: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Department code',
    example: 'DEV-DER',
    required: false,
  })
  departmentCode: string;
}
