import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

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
}
