import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOtPolicyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Code',
    example: 'OT001',
  })
  code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name',
    example: 'OT Policy 1',
  })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  @ApiProperty({
    description: 'Ot working point',
    example: 1.5,
  })
  otWorkingPoint: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  @ApiProperty({
    description: 'Max day process',
    example: 1.5,
  })
  maxDaysProcess: number;
}
