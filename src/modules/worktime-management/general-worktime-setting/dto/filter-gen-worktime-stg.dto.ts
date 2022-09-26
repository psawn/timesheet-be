import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PageLimitDto } from 'src/common/dto/page-limit.dto';

export class FilterGenWorktimeStgDto extends PageLimitDto {
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
  @Transform(({ key: value }) => value.toUpperCase())
  @ApiProperty({
    description: 'Name',
    example: 'DEV001',
    required: false,
  })
  code?: string;
}
