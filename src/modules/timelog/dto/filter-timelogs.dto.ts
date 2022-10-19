import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FilterDetailTimelogsDto } from './filter-my-timelogs.dto';

export class FilterTimelogsDto extends FilterDetailTimelogsDto {
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
