import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateLeaveBenefitDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name',
    example: 'Employee',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  @ApiProperty({
    description: 'Code',
    example: 'EMP',
  })
  code: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(20)
  @ApiProperty({
    description: 'Standard leave',
    example: 12,
  })
  standardLeave: number;
}
