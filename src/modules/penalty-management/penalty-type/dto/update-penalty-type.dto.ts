import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  Min,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { PenaltyGroupEnum } from 'src/common/constants/penalty-group.enum';
import { PenaltyTypeEnum } from 'src/common/constants/penalty-type.enum';

export class UpdatePenaltyTypeDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Unit',
    example: 1,
  })
  unit: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Reason',
    example: 'This is a reason',
  })
  reason: string;

  @IsOptional()
  @IsEnum(PenaltyTypeEnum)
  @ApiProperty({
    description: 'Penalty type',
    example: PenaltyTypeEnum.DAY,
  })
  type: PenaltyTypeEnum;

  @IsOptional()
  @IsEnum(PenaltyGroupEnum)
  @ApiProperty({
    description: 'Penalty group',
    example: PenaltyGroupEnum.MISSING_LOG_WORK,
  })
  group: PenaltyGroupEnum;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Is active',
    example: true,
  })
  isActive: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Is default',
    example: true,
  })
  isDefault: boolean;
}
