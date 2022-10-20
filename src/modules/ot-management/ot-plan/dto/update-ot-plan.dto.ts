import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateOtPlanDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Ot plan reason',
    example: 'Customer requires Ot',
  })
  reason: string;

  @IsOptional()
  @IsDate()
  @ApiProperty({
    description: 'Start date',
    example: '2022-10-01',
  })
  startDate: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty({
    description: 'End date',
    example: '2022-10-01',
  })
  endDate: Date;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Is active',
    example: true,
  })
  isActive: boolean;
}
