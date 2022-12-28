import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageLimitDto } from 'src/common/dto/page-limit.dto';

export class FilterProjectUserDto extends PageLimitDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User code',
    example: 'EMP001',
    required: false,
  })
  userCode?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User name',
    example: 'Mark',
    required: false,
  })
  userName?: string;
}
