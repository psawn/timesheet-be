import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignInDtoArg } from './auth.args';
import { AuthService } from './auth.service';
import { SignInResponse } from './auth.type';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignInResponse)
  async signIn(
    @Args({ type: () => SignInDtoArg }) { signInDto }: SignInDtoArg,
  ): Promise<SignInResponse> {
    return await this.authService.signIn(signInDto);
  }
}
