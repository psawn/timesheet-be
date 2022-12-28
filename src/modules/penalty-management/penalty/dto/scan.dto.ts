import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty } from 'class-validator';
import { PenaltyGroupEnum } from 'src/common/constants/penalty-group.enum';

export class ScanDto {
  @IsNotEmpty()
  @IsEnum(PenaltyGroupEnum)
  @ApiProperty({
    description: 'Penalty group',
    example: PenaltyGroupEnum.MISSING_LOG_WORK,
    enum: PenaltyGroupEnum,
  })
  penaltyGroup: PenaltyGroupEnum;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    description: 'Start date',
    example: '2022-10-01',
    required: false,
  })
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    description: 'End date',
    example: '2022-10-01',
    required: false,
  })
  endDate: Date;
}
