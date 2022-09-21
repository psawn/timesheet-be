import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PageLimitDto } from 'src/common/dto/page-limit.dto';

export class FilterPoliciesDto extends PageLimitDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Name',
    example: 'DEV001',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Code',
    example: 'TS',
    required: false,
  })
  @Transform(({ key: value }) => value.toUpperCase())
  code?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Group',
    example: 'Absence',
    required: false,
  })
  group: string;

  @IsOptional()
  @ApiProperty({
    description: 'Is active',
    example: true,
    required: false,
  })
  isActive: boolean;
}
