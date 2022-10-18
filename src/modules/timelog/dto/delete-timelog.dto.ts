import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class DeleteTimelogDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Project code',
    example: 'PRJ001',
  })
  projectCode: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    description: 'Check date',
    example: '2022-10-01',
  })
  checkDate: Date;
}
