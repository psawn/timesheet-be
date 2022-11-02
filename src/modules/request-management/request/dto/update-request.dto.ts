import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { RequestDateDto } from '../../request-date/dto/request-date.dto';

export class UpdateRequestDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Reason',
    example: 'This is a reason',
    required: false,
  })
  reason: string;

  @IsOptional()
  @ArrayNotEmpty()
  @Type(() => RequestDateDto)
  @ApiProperty({
    description: 'Date',
    example: [{ startDate: '2022-10-01', endDate: '2022-10-01' }],
    required: false,
  })
  dates: RequestDateDto[];
}
