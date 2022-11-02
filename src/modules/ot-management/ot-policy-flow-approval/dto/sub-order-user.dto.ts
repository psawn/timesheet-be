import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class SubOrderUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User code',
    example: 'EMP001',
  })
  userCode: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Sub order',
    example: 1,
  })
  subOrder: number;
}
