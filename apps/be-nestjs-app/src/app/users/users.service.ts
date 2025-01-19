import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import { JwtUtilsService } from '../utils/jwt/jwtUtils.service';
import { TokenDto } from '../utils/jwt/jwt.dto';
import {
  LoginRequest,
  RegisterRequest,
  UserRole,
} from '@pregnancy-journal-monorepo/contract';
import { UserEntity } from './models/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtUtilsService: JwtUtilsService,
    private readonly configService: ConfigService
  ) {}

  signAccessToken({ user_id, role }: { user_id: string; role: UserRole }) {
    return this.jwtUtilsService.signToken({
      payload: { user_id, role },
      options: {
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRES_IN'
        ),
      },
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  signRefreshToken({
    user_id,
    role,
    expiresIn,
  }: {
    user_id: string;
    role: UserRole;
    expiresIn?: string;
  }) {
    return this.jwtUtilsService.signToken({
      payload: { user_id, role },
      options: {
        expiresIn:
          expiresIn ||
          this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
      },
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
    });
  }

  async checkPhone(phone: string): Promise<UserEntity> {
    const result = await this.databaseService.User.findFirst({
      where: {
        phone,
      },
    });

    return result;
  }

  async checkRefreshToken({
    user_id,
    refresh_token,
  }: {
    user_id: string;
    refresh_token: string;
  }) {
    const result = await this.databaseService.Token.findFirst({
      where: {
        refresh_token,
        user_id,
      },
    });
    if (!result) {
      return null;
    }
    return result.id;
  }

  async users(): Promise<UserEntity[]> {
    const result = await this.databaseService.User.findMany();
    return result;
  }

  async register(data: RegisterRequest) {
    const result = await this.databaseService.User.create({
      data: new UserEntity({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        district: data.district,
        province: data.province,
        ward: data.ward,
        address: data.address,
      }),
    });

    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id: result.id, role: result.role }),
      this.signRefreshToken({ user_id: result.id, role: result.role }),
    ]);
    await this.databaseService.Token.create({
      data: new TokenDto({
        refresh_token: refresh_token,
        user_id: result.id,
      }),
    });
    //create access token and refresh token then return
    return { access_token, refresh_token };
  }

  async login(data: LoginRequest) {
    const { email, password } = data;
    const user = await this.databaseService.User.findFirst({
      where: {
        email,
        password,
      },
    });
    if (!user) {
      return null;
    }
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id: user.id, role: user.role }),
      this.signRefreshToken({ user_id: user.id, role: user.role }),
    ]);

    await this.databaseService.Token.create({
      data: new TokenDto({
        refresh_token: refresh_token,
        user_id: user.id,
      }),
    });
    //create access token and refresh token then return
    return { access_token, refresh_token };
  }

  async logout(refresh_token_id: string) {
    await this.databaseService.Token.delete({
      where: {
        id: refresh_token_id,
      },
    });
  }

  async refreshToken({
    refresh_token_id,
    user_id,
  }: {
    refresh_token_id: string;
    user_id: string;
  }) {
    const user = await this.databaseService.User.findUnique({
      where: {
        id: user_id,
      },
    });
    //get old refresh token expire time
    const old_refresh_token = await this.databaseService.Token.findUnique({
      where: {
        id: refresh_token_id,
      },
    });
    const newExpiresIn = this.jwtUtilsService.generateNewRefreshTokenExpiry({
      created_at: old_refresh_token.created_at,
      old_expires_in: this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRES_IN'
      ),
    });
    //create new access token and refresh token
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, role: user.role }),
      this.signRefreshToken({
        user_id,
        role: UserRole.MEMBER,
        expiresIn: newExpiresIn,
      }),
    ]);
    await this.databaseService.Token.update({
      where: {
        id: refresh_token_id,
      },
      data: {
        refresh_token: refresh_token,
        updated_at: new Date(),
      },
    });

    return { access_token, refresh_token };
  }
}
