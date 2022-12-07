import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';
import { RoleCodeEnum } from 'src/common/constants/role.enum';

@InputType()
export class CreateUserDto {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email',
    example: 'test@gmail.com',
  })
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Code',
    example: 'EMP004',
  })
  @Transform(({ value }) => value.toUpperCase())
  code: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Password',
    example: 'test@gmail.com',
  })
  password: string;

  @Field()
  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({
    description: 'Phone',
    example: '0972055909',
  })
  phone: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Department',
    example: 'DEV-DER',
  })
  department: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Manager code',
    example: 'DEV001',
  })
  managerCode: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Worktime code',
    example: 'WT001',
  })
  worktimeCode: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Leave benefit code',
    example: 'EMP',
  })
  leaveBenefitCode: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name',
    example: 'Mark',
  })
  name: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(RoleCodeEnum)
  @ApiProperty({
    description: 'Role',
    example: RoleCodeEnum.EMP,
  })
  role: string;
}
