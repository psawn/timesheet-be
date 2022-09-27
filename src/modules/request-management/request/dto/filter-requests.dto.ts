import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PageLimitDto } from 'src/common/dto/page-limit.dto';

export class FilterRequestsDto extends PageLimitDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Status',
    example: 'waiting',
    required: false,
  })
  status?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Policy code',
    example: 'MISS_IN_01',
    required: false,
  })
  policyCode?: string;
}
