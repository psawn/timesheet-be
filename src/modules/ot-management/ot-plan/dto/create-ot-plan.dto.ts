import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateOtPlan {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Ot plan name',
    example: 'OT plan 01',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Project code',
    example: 'PRJ001',
  })
  projectCode: string;

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

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Ot plan reason',
    example: 'Customer requires Ot',
  })
  reason: string;
}
