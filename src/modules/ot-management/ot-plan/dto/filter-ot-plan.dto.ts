import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';
import { PageLimitDto } from 'src/common/dto/page-limit.dto';

export class FilterOtPlanDto extends PageLimitDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Project code',
    example: 'PRJ001',
  })
  projectCode: string;

  @IsOptional()
  @IsDate()
  @ApiProperty({
    description: 'Start date',
    example: '2022-10-01',
  })
  startDate: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty({
    description: 'End date',
    example: '2022-10-01',
  })
  endDate: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Status',
    example: StatusRequestEnum.WAITING,
  })
  status: string;
}
