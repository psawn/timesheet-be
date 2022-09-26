import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name',
    example: 'DEV-SAV',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ key: value }) => value.toUpperCase())
  @ApiProperty({
    description: 'Code',
    example: 'DEV001',
  })
  code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Manager code',
    example: 'ENV001',
  })
  managerCode: string;
}
