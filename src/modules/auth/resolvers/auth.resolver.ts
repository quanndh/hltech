import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';
import { User } from 'src/modules/users/entities/user.entity';
import { LoginInput } from '../dto/login.input';
import { SignUpInput } from '../dto/auth.dto';
import {
  Authenticated,
  CurrentUser,
} from 'src/core/decorators/common.decorator';
import { GraphQLContext } from 'src/core/graphql/app.graphql-context';
import { AuthConnection } from 'src/modules/auth/entities/auth_connection.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User, {
    description: 'Get current user infomation',
  })
  @Authenticated()
  me(@CurrentUser() user: User) {
    return user;
  }

  @Mutation(() => AuthConnection, {
    description: 'Login with username',
  })
  async login(
    @Args('input', { type: () => LoginInput, nullable: false })
    input: LoginInput,
    @Context() ctx: GraphQLContext,
  ) {
    const data = await this.authService.login(input.username, input.password);

    // console.log({ data });

    // ctx.res.cookie('token', data.accessToken, {
    //   expires: dayjs(jwtDecode<JWTDecodeValue>(data.accessToken).exp * 1000).toDate(),
    //   sameSite: true,
    //   httpOnly: true,
    // });
    return data;
  }

  @Mutation(() => AuthConnection, {
    description: 'Siggup with email',
  })
  signUp(@Args('input') input: SignUpInput) {
    return this.authService.signUp(input);
  }
}
