import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';

export class ExcelTimecheckDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Worktime code',
    example: 'WT',
  })
  worktimeCode: string;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({
    description: 'Start date',
    example: '2022-10-01',
  })
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({
    description: 'End date',
    example: '2022-10-01',
  })
  endDate: Date;
}
