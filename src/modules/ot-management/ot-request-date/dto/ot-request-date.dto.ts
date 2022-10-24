import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class OtRequestDateDto {
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    description: 'Date',
    example: '2022-10-01',
  })
  date: Date;

  @IsNotEmpty()
  @Min(1)
  @Max(10)
  @IsNumber()
  @ApiProperty({
    description: 'Ot hour',
    example: 1,
  })
  otHour: number;
}
