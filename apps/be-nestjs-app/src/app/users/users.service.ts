import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginRequest, RegisterRequest, Status, UserCreateRequest, UserRole, UserUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';
import { TokenDto } from '../utils/jwt/jwt.dto';
import { JwtUtilsService } from '../utils/jwt/jwtUtils.service';
import { UserEntity } from './models/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtUtilsService: JwtUtilsService,
    private readonly configService: ConfigService,
  ) {}

  signAccessToken({ user_id, role }: { user_id: string; role: UserRole }) {
    return this.jwtUtilsService.signToken({
      payload: { user_id, role },
      options: {
        expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
      },
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  signRefreshToken({ user_id, role, expiresIn }: { user_id: string; role: UserRole; expiresIn?: string }) {
    return this.jwtUtilsService.signToken({
      payload: { user_id, role },
      options: {
        expiresIn: expiresIn || this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
      },
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
    });
  }

  signEmailToken({ user_id, role }: { user_id: string; role: UserRole }) {
    return this.jwtUtilsService.signToken({
      payload: { user_id, role },
      options: {
        expiresIn: this.configService.get<string>('JWT_EMAIL_TOKEN_EXPIRES_IN'),
      },
      secret: this.configService.get<string>('JWT_EMAIL_TOKEN_SECRET'),
    });
  }

  //
  // async checkEmail(email: string): Promise<UserEntity> {
  //   const result = await this.databaseService.User.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  //   return result;
  // }

  // async checkEmailVerifyToken({
  //   email_verify_token,
  //   user_id,
  // }: {
  //   email_verify_token: string;
  //   user_id: string;
  // }) {
  //   const result = await this.databaseService.User.findUnique({
  //     where: {
  //       id: user_id,
  //       email_verify_token,
  //     },
  //   });
  //   return Boolean(result);
  // }

  async checkEmail(email: string): Promise<UserEntity> {
    const result = await this.databaseService.User.findFirst({
      where: {
        email,
      },
    });

    return result;
  }

  async checkRefreshToken({ user_id, refresh_token }: { user_id: string; refresh_token: string }) {
    const result = await this.databaseService.Token.findFirst({
      where: {
        refresh_token: refresh_token,
        user_id,
      },
    });
    if (!result) {
      return null;
    }
    return result.id;
  }

  // async checkVerifyStatus(user_id: string) {
  //   const result = await this.databaseService.User.findUnique({
  //     where: {
  //       id: user_id,
  //     },
  //   });
  //   return result.verify_status;
  // }

  async users(): Promise<UserEntity[]> {
    const result = await this.databaseService.User.findMany();
    return result;
  }

  async register(data: RegisterRequest) {
    //check if email already exists
    const result = await this.databaseService.User.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        province: data.province,
        district: data.district,
        ward: data.ward,
        address: data.address,
        role: UserRole.MEMBER,
        expected_birth_date: data.expected_birth_date,
        status: Status.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    // const email_verify_token = await this.signEmailToken({
    //   user_id: result.id,
    //   role: UserRole.USER,
    // });
    //send email verify token to user email
    // console.log(
    //   `http://localhost:3000/users/email-verify?email_verify_token=${email_verify_token}`,
    // );
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id: result.id, role: result.role }),
      this.signRefreshToken({ user_id: result.id, role: result.role }),
    ]);
    await this.databaseService.Token.create({
      data: {
        ...new TokenDto({
          refresh_token: refresh_token,
          user_id: result.id,
        }),
        user: {
          connect: {
            id: result.id,
          },
        },
      },
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
      data: {
        ...new TokenDto({
          refresh_token: refresh_token,
          user_id: user.id,
        }),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    //create access token and refresh token then return
    return { access_token, refresh_token };
  }

  // async emailVerify({
  //   email_verify_token,
  //   user_id,
  // }: {
  //   email_verify_token: string;
  //   user_id: string;
  // }) {
  //   await this.databaseService.User.update({
  //     where: {
  //       id: user_id,
  //       email_verify_token,
  //     },
  //     data: {
  //       verify_status: UserVerifyStatus.VERIFIED,
  //       email_verify_token: '',
  //       updated_at: new Date(),
  //     },
  //   });
  // }

  async logout(refresh_token_id: string) {
    await this.databaseService.Token.delete({
      where: {
        id: refresh_token_id,
      },
    });
  }

  async refreshToken({ refresh_token_id, user_id }: { refresh_token_id: string; user_id: string }) {
    //get old refresh token expire time
    const old_refresh_token = await this.databaseService.Token.findUnique({
      where: {
        id: refresh_token_id,
      },
    });
    const newExpiresIn = this.jwtUtilsService.generateNewRefreshTokenExpiry({
      created_at: old_refresh_token.created_at,
      old_expires_in: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    });
    //create new access token and refresh token
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, role: UserRole.MEMBER }),
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

  async create(userCreateRequest: UserCreateRequest) {
    const user = await this.databaseService.User.create({
      data: {
        name: userCreateRequest.name,
        email: userCreateRequest.email,
        password: userCreateRequest.password,
        phone: userCreateRequest.phone,
        province: userCreateRequest.province,
        district: userCreateRequest.district,
        ward: userCreateRequest.ward,
        address: userCreateRequest.address,
        role: userCreateRequest.role,
        status: userCreateRequest.status,
        expected_birth_date: new Date(userCreateRequest.expected_birth_date),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    return user;
  }

  getUserById(id: string) {
    const user = this.databaseService.User.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(updateUser: UserUpdateRequest) {
    await this.getUserById(updateUser.id);

    return this.databaseService.User.update({
      where: {
        id: updateUser.id,
      },
      data: {
        ...updateUser,
        updated_at: new Date(),
      },
    });
  }
}
