import { IsNumberString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PageLimitDto {
  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    description: 'Page',
    example: '1',
    required: false,
  })
  page?: number;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    description: 'Items per page',
    example: '10',
    required: false,
  })
  limit?: number;
}
