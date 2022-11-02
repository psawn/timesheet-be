import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';
import { PageLimitDto } from 'src/common/dto/page-limit.dto';

export class FilterOtPlanDto extends PageLimitDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Project code',
    example: 'PRJ001',
    required: false,
  })
  projectCode: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    description: 'Start date',
    example: '2022-10-01',
    required: false,
  })
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    description: 'End date',
    example: '2022-10-01',
    required: false,
  })
  endDate: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Status',
    example: StatusRequestEnum.WAITING,
    required: false,
  })
  status: string;
}
