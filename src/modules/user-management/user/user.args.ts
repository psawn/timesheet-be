import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateUserDto } from './dto';

@ArgsType()
export class CreateUserDtoArg {
  @Field(() => CreateUserDto)
  @Type(() => CreateUserDto)
  @ValidateNested()
  createUserDto: CreateUserDto;
}
