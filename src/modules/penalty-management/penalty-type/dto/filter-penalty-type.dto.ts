import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PenaltyGroupEnum } from 'src/common/constants/penalty-group.enum';
import { PenaltyTypeEnum } from 'src/common/constants/penalty-type.enum';
import { PageLimitDto } from 'src/common/dto/page-limit.dto';

export class FilterPenaltyTypeDto extends PageLimitDto {
  @IsOptional()
  @IsEnum(PenaltyTypeEnum)
  @ApiProperty({
    description: 'Type',
    enum: PenaltyTypeEnum,
    example: PenaltyTypeEnum.DAY,
    required: false,
  })
  type?: PenaltyTypeEnum;

  @IsOptional()
  @IsEnum(PenaltyGroupEnum)
  @ApiProperty({
    description: 'Type',
    enum: PenaltyGroupEnum,
    example: PenaltyGroupEnum.MISSING_LOG_WORK,
    required: false,
  })
  group?: PenaltyTypeEnum;

  @IsOptional()
  @ApiProperty({
    description: 'Is active',
    example: true,
    required: false,
  })
  isActive?: boolean;
}
