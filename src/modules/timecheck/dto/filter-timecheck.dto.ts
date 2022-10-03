import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { PageLimitDto } from 'src/common/dto/page-limit.dto';

export class FilterTimecheckDto extends PageLimitDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Start date',
    example: '2022-10-01',
  })
  startDate: Date;

  @IsNotEmpty()
  @ApiProperty({
    description: 'End date',
    example: '2022-10-01',
  })
  endDate: Date;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'GEt all',
    example: false,
  })
  getAll: boolean;
}
