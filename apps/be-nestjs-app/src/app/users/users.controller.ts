import { Body, Controller, Param, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import {
  authContract,
  LoginRequest,
  RegisterRequest,
  TokenRequest,
  userContract,
  UserCreateRequest,
  UserUpdateRequest,
} from '@pregnancy-journal-monorepo/contract';
import { AccessTokenAuthGuard, RefreshTokenAuthGuard } from '../auth/auth.guard';
import { RequestWithJWT } from 'express';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //sử dung them middleware
  @TsRestHandler(authContract.login)
  async handleLogin(@Body() body: LoginRequest) {
    return tsRestHandler(authContract.login, async () => {
      const users = await this.usersService.login(body);
      console.log('users', users);
      if (!users) {
        throw new UnauthorizedException('Phone number or password is incorrect');
      }
      return { status: 200, body: users };
    });
  }

  @TsRestHandler(authContract.register)
  async handleRegister(@Body() body: RegisterRequest) {
    return tsRestHandler(authContract.register, async () => {
      const phone = await this.usersService.checkPhone(body.phone);
      if (!phone) {
        const users = await this.usersService.register(body);
        return { status: 200, body: users };
      } else {
        return {
          status: 401,
          body: { message: 'Phone number is already registered' },
        };
      }
    });
  }

  @UseGuards(AccessTokenAuthGuard, RefreshTokenAuthGuard)
  @TsRestHandler(authContract.logout)
  async handleLogout(@Body() body: TokenRequest, @Req() req: RequestWithJWT) {
    return tsRestHandler(authContract.logout, async () => {
      const { user_id } = req.decoded_authorization;
      const { refresh_token } = body;
      const refresh_token_id = await this.usersService.checkRefreshToken({
        user_id,
        refresh_token,
      });
      if (!refresh_token_id) {
        throw new UnauthorizedException('Unauthorized Refresh Token');
      }
      await this.usersService.logout(refresh_token_id);
      return {
        status: 200,
        body: { message: 'Logout successfully' },
      };
    });
  }

  @UseGuards(RefreshTokenAuthGuard)
  @TsRestHandler(authContract.refreshToken)
  async handleRefreshToken(@Body() body: TokenRequest, @Req() req: RequestWithJWT) {
    return tsRestHandler(authContract.refreshToken, async () => {
      const { user_id } = req.decoded_refresh_token;
      const { refresh_token } = body;
      const refresh_token_id = await this.usersService.checkRefreshToken({
        user_id,
        refresh_token,
      });
      if (!refresh_token_id) {
        throw new UnauthorizedException('Unauthorized Refresh Token');
      }
      const users = await this.usersService.refreshToken({
        refresh_token_id,
        user_id,
      });
      return { status: 200, body: users };
    });
  }

  @TsRestHandler(userContract.create)
  async handleCreate(@Body() body: UserCreateRequest) {
    return tsRestHandler(userContract.create, async () => {
      const users = await this.usersService.create(body);
      return { status: 200, body: users };
    });
  }

  @TsRestHandler(userContract.getAll)
  handleGetAll() {
    return tsRestHandler(userContract.getAll, async () => {
      const users = await this.usersService.users();
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
  async handleUpdate(@Body() body: UserUpdateRequest) {
    return tsRestHandler(userContract.update, async () => {
      const users = await this.usersService.updateUser(body);
      return { status: 200, body: users };
    });
  }
}
