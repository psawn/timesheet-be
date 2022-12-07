import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SignInDto {
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
    description: 'Password',
    example: 'test@gmail.com',
  })
  password: string;
}
