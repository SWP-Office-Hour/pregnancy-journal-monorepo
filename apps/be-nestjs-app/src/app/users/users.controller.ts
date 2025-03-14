import { Body, ConflictException, Controller, NotFoundException, Param, Req, UseGuards } from '@nestjs/common';
import {
  authContract,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  userContract,
  UserCreateRequestType,
  UserUpdateRequestType,
} from '@pregnancy-journal-monorepo/contract';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { RequestWithJWT } from 'express';
import { AccessTokenAuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //sử dung them middleware
  @TsRestHandler(authContract.login)
  async handleLogin(@Body() body: LoginRequest) {
    return tsRestHandler(authContract.login, async () => {
      const user = await this.usersService.login(body);
      if (!user) {
        throw new NotFoundException('Phone number or password is incorrect');
      }

      return { status: 200, body: user };
    });
  }

  @TsRestHandler(authContract.register)
  async handleRegister(@Body() body: RegisterRequest) {
    return tsRestHandler(authContract.register, async () => {
      const email = await this.usersService.checkEmail(body.email);
      if (!email) {
        const users = await this.usersService.register(body);
        return { status: 201, body: users };
      } else {
        return {
          status: 401,
          body: { message: 'Email is already registered' },
        };
      }
    });
  }

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(authContract.signInWithToken)
  async handleSignInWithToken(@Req() req: RequestWithJWT) {
    return tsRestHandler(authContract.signInWithToken, async () => {
      const user_id = req.decoded_authorization?.user_id;

      if (!user_id) {
        throw new NotFoundException('Token is invalid');
      }

      const user = await this.usersService.signInWithToken(user_id);
      if (!user) {
        throw new NotFoundException('Token is invalid');
      }
      return { status: 201, body: user };
    });
  }

  // @TsRestHandler(authContract.changePassword)
  // async handleChangePassword(@Body() body: any) {
  //   return tsRestHandler(authContract.changePassword, async () => {
  //     const user = await this.usersService.changePassword(body);
  //     if (!user) {
  //       throw new NotFoundException('Token is invalid');
  //     }
  //     return { status: 201, body: user };
  //   });
  // }

  // @UseGuards(AccessTokenAuthGuard, RefreshTokenAuthGuard)
  // @TsRestHandler(authContract.logout)
  // async handleLogout(@Body() body: TokenRequest, @Req() req: RequestWithJWT) {
  //   return tsRestHandler(authContract.logout, async () => {
  //     const user_id = req.decoded_authorization;
  //     const { refresh_token } = body;
  //
  //     if (!user_id) {
  //       throw new UnauthorizedException('Unauthorized');
  //     }
  //
  //     // const refresh_token_id = await this.usersService.checkRefreshToken({
  //     //   user_id,
  //     //   refresh_token,
  //     // });
  //     // if (!refresh_token_id) {
  //     //   throw new UnauthorizedException('Unauthorized Refresh Token');
  //     // }
  //     await this.usersService.logout(user_id);
  //     return {
  //       status: 200,
  //       body: { message: 'Logout successfully' },
  //     };
  //   });
  // }

  // @UseGuards(RefreshTokenAuthGuard)
  // @TsRestHandler(authContract.refreshToken)
  // async handleRefreshToken(@Body() body: TokenRequest, @Req() req: RequestWithJWT) {
  //   return tsRestHandler(authContract.refreshToken, async () => {
  //     const { user_id } = req.decoded_refresh_token;
  //     const { refresh_token } = body;
  //     const refresh_token_id = await this.usersService.checkRefreshToken({
  //       user_id,
  //       refresh_token,
  //     });
  //     if (!refresh_token_id) {
  //       throw new UnauthorizedException('Unauthorized Refresh Token');
  //     }
  //     const users = await this.usersService.refreshToken({
  //       refresh_token_id,
  //       user_id,
  //     });
  //     return { status: 200, body: users };
  //   });
  // }

  @TsRestHandler(userContract.create)
  async handleCreate(@Body() body: UserCreateRequestType) {
    //check if email already exists
    const user = await this.usersService.checkEmail(body.email);
    if (user) {
      throw new ConflictException('Email already exists');
    }
    return tsRestHandler(userContract.create, async () => {
      const users = await this.usersService.create(body);
      return { status: 200, body: users };
    });
  }

  // @Roles(UserRole.ADMIN)
  // @UseGuards(RoleAuthGuard, AccessTokenAuthGuard)
  @TsRestHandler(userContract.getAll)
  handleGetAll() {
    return tsRestHandler(userContract.getAll, async () => {
      const users = await this.usersService.users();
      return { status: 200, body: users };
    });
  }

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(userContract.getProfile)
  async handleGetProfile(@Req() req: RequestWithJWT, @Param('id') id: string) {
    return tsRestHandler(userContract.getProfile, async () => {
      const user_id = req.decoded_authorization?.user_id;
      if (!user_id) {
        throw new NotFoundException('User ko  not found');
      }
      const users = await this.usersService.getUserProfile(user_id);
      return { status: 200, body: users };
    });
  }

  @TsRestHandler(userContract.getOne)
  async handleGetOne(@Param('id') id: string) {
    return tsRestHandler(userContract.getOne, async () => {
      const users = await this.usersService.getUserById(id);
      return { status: 200, body: users };
    });
  }

  @TsRestHandler(userContract.update)
  async handleUpdate(@Body() body: UserUpdateRequestType) {
    return tsRestHandler(userContract.update, async () => {
      if (!body.user_id) {
        throw new NotFoundException('User not found');
      }
      const users = await this.usersService.updateUser(body);
      return { status: 200, body: users };
    });
  }

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(userContract.updateProfile)
  async handleUpdateProfile(@Body() body: UserUpdateRequestType, @Req() req: RequestWithJWT) {
    return tsRestHandler(userContract.updateProfile, async () => {
      const user_id = req.decoded_authorization?.user_id;
      if (!user_id) {
        throw new NotFoundException('User not found');
      }
      const users = await this.usersService.updateProfile(body, user_id);
      return { status: 200, body: users };
    });
  }

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(authContract.changePassword)
  async handleChangePassword(@Body() body: ChangePasswordRequest, @Req() req: RequestWithJWT) {
    return tsRestHandler(authContract.changePassword, async () => {
      const user_id = req.decoded_authorization?.user_id;
      if (!user_id) {
        throw new NotFoundException('User not found');
      }

      const user = await this.usersService.changePassword(body, user_id);
      if (!user) {
        throw new NotFoundException('Token is invalid');
      }
      return { status: 201, body: user };
    });
  }

  @TsRestHandler(authContract.forgotPassword)
  async handleForgotPassword(@Body() body: ForgotPasswordRequest) {
    return tsRestHandler(authContract.forgotPassword, async () => {
      const result = await this.usersService.forgotPassword(body.email);
      if (!result) {
        throw new NotFoundException('Email is invalid');
      }
      return {
        status: 201,
        body: {
          message: result,
        },
      };
    });
  }
}
