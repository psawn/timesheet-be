import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WorktimePerDayDto } from '../../general-worktime/dto';

export class CreateGenWorktimeStgDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name',
    example: 'Working time 8h30 to 18h',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ key: value }) => value.toUpperCase())
  @ApiProperty({
    description: 'Code',
    example: 'WT001',
  })
  code: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorktimePerDayDto)
  @ApiProperty({
    description: 'Work times',
    example: [
      {
        dayOfWeek: 0,
        isDayOff: true,
        checkInTime: '08:00',
        checkOutTime: '18:00',
      },
      {
        dayOfWeek: 1,
        isDayOff: true,
        checkInTime: '08:00',
        checkOutTime: '18:00',
      },
    ],
  })
  worktimes: WorktimePerDayDto[];
}
