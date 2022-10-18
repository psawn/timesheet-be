import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateTimelogDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Project code',
    example: 'PRJ001',
  })
  projectCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Description',
    example: 'Do task for project PRJ001',
  })
  description: string;

  @IsNotEmpty()
  @Min(0)
  @Max(24)
  @IsNumber()
  @ApiProperty({
    description: 'Log hour',
    example: 1.5,
  })
  logHour: number;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    description: 'Check date',
    example: '2022-10-01',
  })
  checkDate: Date;
}
