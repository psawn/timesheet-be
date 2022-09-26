import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsMilitaryTime,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class WorktimePerDayDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(6)
  @ApiProperty({
    description: 'Day of week (0 - 6)',
    example: 0,
  })
  dayOfWeek: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'Is day off',
    example: false,
  })
  isDayOff: boolean;

  @IsNotEmpty()
  @IsMilitaryTime()
  @IsString()
  @ApiProperty({
    description: 'Check in time',
    example: '08:00',
  })
  checkInTime: string;

  @IsNotEmpty()
  @IsMilitaryTime()
  @IsString()
  @ApiProperty({
    description: 'Check out time',
    example: '18:00',
  })
  checkOutTime: string;
}
