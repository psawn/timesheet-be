import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { SignInDto } from './dto';

@ArgsType()
export class SignInDtoArg {
  @Field(() => SignInDto)
  @Type(() => SignInDto)
  @ValidateNested()
  signInDto: SignInDto;
}
