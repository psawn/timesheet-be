import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { PageLimitDto } from 'src/common/dto/page-limit.dto';

export class FilterUsersDto extends PageLimitDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'Email',
    example: 'test@gmail.com',
    required: false,
  })
  email?: string;
}
