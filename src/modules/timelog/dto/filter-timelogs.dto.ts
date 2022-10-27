import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PageLimitDto } from 'src/common/dto/page-limit.dto';

export class FilterTimelogsDto extends PageLimitDto {
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

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Project code',
    example: 'PRJ001',
    required: false,
  })
  projectCode: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    description: 'Start date',
    example: '2022-10-01',
  })
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    description: 'End date',
    example: '2022-10-01',
  })
  endDate: Date;
}
