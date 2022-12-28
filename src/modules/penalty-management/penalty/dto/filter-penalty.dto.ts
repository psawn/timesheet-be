import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsDate, IsString, IsEnum } from 'class-validator';
import { PenaltyGroupEnum } from 'src/common/constants/penalty-group.enum';
import { PenaltyTypeEnum } from 'src/common/constants/penalty-type.enum';
import { PageLimitDto } from 'src/common/dto/page-limit.dto';

export class FilterPenaltiesDto extends PageLimitDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User code',
    example: 'EMP001',
    required: false,
  })
  userCode?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    description: 'Start date',
    example: '2022-10-01',
    required: false,
  })
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    description: 'End date',
    example: '2022-10-01',
    required: false,
  })
  endDate: Date;

  @IsOptional()
  @IsEnum(PenaltyTypeEnum)
  @ApiProperty({
    description: 'Penalty type',
    example: PenaltyTypeEnum.DAY,
    enum: PenaltyTypeEnum,
    required: false,
  })
  penaltyType?: PenaltyTypeEnum;

  @IsOptional()
  @IsEnum(PenaltyGroupEnum)
  @ApiProperty({
    description: 'Penalty group',
    example: PenaltyGroupEnum.MISSING_LOG_WORK,
    enum: PenaltyGroupEnum,
    required: false,
  })
  penaltyGroup?: PenaltyGroupEnum;
}
