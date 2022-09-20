import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageLimitDto } from 'src/common/dto/page-limit.dto';

export class FilterProjectDto extends PageLimitDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Project code',
    example: 'TS',
    required: false,
  })
  code?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Project name',
    example: 'Timesheet',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Department code',
    example: 'DIV001',
    required: false,
  })
  deparmentCode: string;
}
