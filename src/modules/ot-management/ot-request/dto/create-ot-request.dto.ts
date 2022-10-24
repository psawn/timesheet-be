import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { OtRequestDateDto } from '../../ot-request-date/dto';

export class CreateOtRequestDto {
  @ArrayNotEmpty()
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

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Reason',
    example: 'This is the reason',
  })
  reason: string;

  @IsNotEmpty()
  @IsUUID('all')
  @ApiProperty({
    description: 'Ot plan id',
    example: '4cefe845-cf72-408b-b8f5-9c51a3bd441a',
  })
  otPlanId: string;
}
