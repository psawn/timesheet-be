import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OtRequestDateDto } from '../../ot-request-date/dto';

export class UpdateOtRequestDto {
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
  @IsArray()
  @Type(() => OtRequestDateDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    description: 'Ot request date',
    example: [
      {
        date: '2022-10-20',
        otHour: 1,
      },
    ],
  })
  otRequestDates: OtRequestDateDto[];
}
