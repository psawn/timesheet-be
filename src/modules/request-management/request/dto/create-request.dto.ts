import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { RequestDateDto } from '../../request-date/dto/request-date.dto';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Policy code',
    example: 'DEV001',
  })
  policyCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Reason',
    example: 'This is a reason',
  })
  reason: string;

  @IsNotEmpty()
  @IsInt()
  @Min(-12)
  @Max(12)
  @ApiProperty({
    description: 'Timezone',
    example: -7,
  })
  timezone: number;

  @ArrayNotEmpty()
  @Type(() => RequestDateDto)
  @ApiProperty({
    description: 'Date',
    example: [{ startDate: '2022-10-01', endDate: '2022-10-01' }],
  })
  dates: RequestDateDto[];
}
