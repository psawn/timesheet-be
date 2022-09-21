import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty } from 'class-validator';

export class UserCodesDto {
  @ArrayNotEmpty()
  @ApiProperty({
    description: 'User codes',
    example: [],
  })
  userCodes: string[];
}
