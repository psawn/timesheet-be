import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { Roles } from 'src/decorators/role.decorator';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { GqlRolesGuard } from 'src/guards/qpl-role.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { CreateUserDtoArg } from './user.args';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(RoleCodeEnum.ADMIN)
  @Query(() => User)
  async get(@Args('code') code: string): Promise<User> {
    return await this.userService.findOneByConditions({
      where: { code },
    });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(RoleCodeEnum.ADMIN)
  @Mutation(() => User)
  async create(
    @Args({ type: () => CreateUserDtoArg }) { createUserDto }: CreateUserDtoArg,
  ) {
    return await this.userService.create(createUserDto);
  }
}
