import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CheckInDto {
  @IsNotEmpty()
  @IsInt()
  @Min(-12)
  @Max(12)
  @ApiProperty({
    description: 'Timezone',
    example: -7,
  })
  timezone: number;
}
