import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ExcelTimecheckDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Worktime code',
    example: 'WT',
  })
  worktimeCode: string;

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
}
