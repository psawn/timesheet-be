import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WorktimePerDayDto } from '../../general-worktime/dto';

export class UpdateGenWorktimeStgDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Name',
    example: 'Working time 8h30 to 18h',
  })
  name: string;

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
