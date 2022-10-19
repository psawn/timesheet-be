import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PageLimitDto } from 'src/common/dto/page-limit.dto';

export class FilterDetailTimelogsDto extends PageLimitDto {
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
