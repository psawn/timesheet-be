import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { PenaltyGroupEnum } from 'src/common/constants/penalty-group.enum';
import { PenaltyTypeEnum } from 'src/common/constants/penalty-type.enum';

export class CreatePenaltyTypeDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  @ApiProperty({
    description: 'Code',
    example: 'PENALTY_001',
  })
  code: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Unit',
    example: 1,
  })
  unit: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Reason',
    example: 'This is a reason',
  })
  reason: string;

  @IsNotEmpty()
  @IsEnum(PenaltyTypeEnum)
  @ApiProperty({
    description: 'Penalty type',
    example: PenaltyTypeEnum.DAY,
  })
  type: PenaltyTypeEnum;

  @IsNotEmpty()
  @IsEnum(PenaltyGroupEnum)
  @ApiProperty({
    description: 'Penalty group',
    example: PenaltyGroupEnum.MISSING_LOG_WORK,
  })
  group: PenaltyGroupEnum;
}
