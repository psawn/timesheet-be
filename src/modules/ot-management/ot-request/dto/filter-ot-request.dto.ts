import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PageLimitDto } from 'src/common/dto/page-limit.dto';

export class FilterOtRequestsDto extends PageLimitDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  @ApiProperty({
    description: 'Status',
    example: 'waiting',
    required: false,
  })
  status?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  @ApiProperty({
    description: 'Policy code',
    example: 'MISS_IN_01',
    required: false,
  })
  otPolicyCode?: string;
}
