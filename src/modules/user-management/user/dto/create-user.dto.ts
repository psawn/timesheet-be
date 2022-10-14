import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email',
    example: 'test@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Code',
    example: 'EMP004',
  })
  @Transform(({ value }) => value.toUpperCase())
  code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Password',
    example: 'test@gmail.com',
  })
  password: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({
    description: 'Phone',
    example: '0972055909',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Department',
    example: 'DEV-DER',
  })
  department: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Manager code',
    example: 'DEV001',
  })
  managerCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Worktime code',
    example: 'WT001',
  })
  worktimeCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Leave benefit code',
    example: 'EMP',
  })
  leaveBenefitCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name',
    example: 'Mark',
  })
  name: string;
}
