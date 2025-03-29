import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthResponse,
  ChangePasswordRequest,
  Gender,
  LoginRequest,
  RegisterRequest,
  ReminderType,
  Status,
  UserCreateRequestType,
  UserIncludeMembershipType,
  UserProfileResponseType,
  UserProfileUpdateType,
  UserResponseType,
  UserRole,
  UserUpdateRequestType,
} from '@pregnancy-journal-monorepo/contract';
import { ChildService } from '../child/child.service';
import { DatabaseService } from '../database/database.service';
import { MailService } from '../mail/mail.service';
import { PaymentService } from '../payment/payment.service';
import { PostsService } from '../posts/posts.service';
import { TokenDto } from '../utils/jwt/jwt.dto';
import { JwtUtilsService } from '../utils/jwt/jwtUtils.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtUtilsService: JwtUtilsService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
    @Inject(forwardRef(() => ChildService))
    private readonly childService: ChildService,
  ) {}

  signAccessToken({ user_id, role }: { user_id: string; role: UserRole }) {
    const secret = this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
    if (!secret) {
      throw new NotFoundException('.env file cannot fount JWT_ACCESS_TOKEN_SECRET');
    }

    return this.jwtUtilsService.signToken({
      payload: { user_id, role },
      options: {},
      secret: secret,
    });
  }

  signRefreshToken({ user_id, role, expiresIn }: { user_id: string; role: UserRole; expiresIn?: string }) {
    const secret = this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET') || 'refresh_token_secret';
    return this.jwtUtilsService.signToken({
      payload: { user_id, role },
      options: {
        expiresIn: expiresIn || this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
      },
      secret: secret,
    });
  }

  removeRefreshToken(refresh_token_id: string) {
    return this.databaseService.Token.deleteMany({
      where: {
        refresh_token: refresh_token_id,
      },
    });
  }

  signEmailToken({ user_id, role }: { user_id: string; role: UserRole }) {
    return this.jwtUtilsService.signToken({
      payload: { user_id, role },
      options: {
        expiresIn: this.configService.get<string>('JWT_EMAIL_TOKEN_EXPIRES_IN'),
      },
      secret: this.configService.get<string>('JWT_EMAIL_TOKEN_SECRET') || 'email',
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

  async checkEmail(email: string): Promise<UserResponseType | null> {
    return await this.databaseService.User.findFirst({
      where: {
        email,
      },
    });
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
    return result.user_id;
  }

  // async checkVerifyStatus(user_id: string) {
  //   const result = await this.databaseService.User.findUnique({
  //     where: {
  //       id: user_id,
  //     },
  //   });
  //   return result.verify_status;
  // }

  async users(): Promise<UserResponseType[]> {
    return await this.databaseService.User.findMany({
      omit: {
        password: true,
      },
    });
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
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
        status: Status.ACTIVE,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
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
      this.signAccessToken({ user_id: result.user_id, role: result.role }),
      this.signRefreshToken({ user_id: result.user_id, role: result.role }),
    ]);

    //xóa refresh token
    if (refresh_token) this.removeRefreshToken(refresh_token);
    await this.databaseService.Token.create({
      data: {
        ...new TokenDto({
          refresh_token: refresh_token,
          user_id: result.user_id,
        }),
        user: {
          connect: {
            user_id: result.user_id,
          },
        },
      },
    });
    //create access token and refresh token then return

    const firstChild = await this.databaseService.Child.create({
      data: {
        name: 'Con đầu lòng',
        expected_birth_date: new Date(data.expected_birth_date),
        gender: Gender.UNKNOWN,
        user: {
          connect: {
            user_id: result.user_id,
          },
        },
      },
    });

    await this.databaseService.Reminder.create({
      data: {
        title: 'Ngày sinh dự kiến',
        content: `Ngày sinh dự kiến của bé`,
        remind_date: new Date(data.expected_birth_date),
        type: ReminderType.USER_DUE_DATE,
        status: Status.ACTIVE,
        color: 'ec4899',
        user: {
          connect: {
            user_id: result.user_id,
          },
        },
      },
    });

    const hasMembership = await this.checkAccountMembership(result.user_id);

    return {
      access_token,
      // refresh_token,
      user: {
        user_id: result.user_id,
        name: result.name,
        role: result.role,
        email: result.email,
        // expected_birth_date: firstChild.expected_birth_date.toISOString(),
        has_membership: hasMembership,
        child: [firstChild],
      },
    };
  }

  async login(data: LoginRequest): Promise<AuthResponse | null> {
    const { email, password } = data;
    const user = await this.databaseService.User.findFirst({
      where: {
        email,
        password,
      },
      include: {
        child: {
          orderBy: {
            expected_birth_date: 'desc',
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id: user.user_id, role: user.role }),
      this.signRefreshToken({ user_id: user.user_id, role: user.role }),
    ]);

    //xóa refresh token
    if (refresh_token) this.removeRefreshToken(refresh_token);
    await this.databaseService.Token.create({
      data: {
        ...new TokenDto({
          refresh_token: refresh_token,
          user_id: user.user_id,
        }),
        user: {
          connect: {
            user_id: user.user_id,
          },
        },
      },
    });
    //create access token and refresh token then return
    const child = user.child;
    const membership = await this.getAccountMembership(user.user_id);
    let hasMembership = false;

    if (
      membership &&
      membership.membership_buy_date &&
      membership.membership_expire_date &&
      new Date(membership.membership_expire_date) > new Date()
    ) {
      hasMembership = true;
    }

    return {
      access_token,
      // refresh_token,
      user: {
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        email: user.email,
        // expected_birth_date: child[child.length - 1].expected_birth_date.toISOString(),
        has_membership: hasMembership,
        membership_buy_date: membership?.membership_buy_date ?? undefined,
        membership_expire_date: membership?.membership_expire_date ?? undefined,
        child: child,
      },
    };
  }

  async signInWithToken(userId: string): Promise<AuthResponse | null> {
    const user = await this.databaseService.User.findFirst({
      where: {
        user_id: userId,
      },
      include: {
        child: {
          orderBy: {
            expected_birth_date: 'desc',
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const access_token = await this.signAccessToken({ user_id: user.user_id, role: user.role });

    //create access token and refresh token then return
    const membership = await this.getAccountMembership(user.user_id);
    const child = user.child;
    let hasMembership = false;
    if (
      membership &&
      membership.membership_buy_date &&
      membership.membership_expire_date &&
      new Date(membership.membership_expire_date) > new Date()
    ) {
      hasMembership = true;
    }

    return {
      access_token,
      // refresh_token,
      user: {
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        email: user.email,
        // expected_birth_date: child[child.length - 1].expected_birth_date.toISOString(),
        has_membership: hasMembership,
        membership_buy_date: membership?.membership_buy_date ?? undefined,
        membership_expire_date: membership?.membership_expire_date ?? undefined,
        child: child,
      },
    };
  }

  // async emailVerify({
  //   email_verify_token,
  //   user_user_id,
  // }: {
  //   email_verify_token: string;
  //   user_user_id: string;
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
        token_id: refresh_token_id,
      },
    });
  }

  async refreshToken({ refresh_token_id, user_id }: { refresh_token_id: string; user_id: string }) {
    //get old refresh token expire time
    const old_refresh_token = await this.databaseService.Token.findUnique({
      where: {
        token_id: refresh_token_id,
      },
    });

    if (!old_refresh_token) {
      throw new NotFoundException('Refresh token not found');
    }

    const expired = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN');
    if (!expired) {
      throw new NotFoundException('.env file cannot fount JWT_REFRESH_TOKEN_EXPIRES_IN');
    }
    const newExpiresIn = this.jwtUtilsService.generateNewRefreshTokenExpiry({
      created_at: old_refresh_token.created_at,
      old_expires_in: expired,
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
        token_id: refresh_token_id,
      },
      data: {
        refresh_token: refresh_token,
        updated_at: new Date(Date.now()),
      },
    });

    return { access_token, refresh_token };
  }

  async forgotPassword(email: string) {
    const user = await this.databaseService.User.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    //send email verify token to user email
    const code = await this.mailService.resetPassword(user);

    const userAfter = await this.databaseService.User.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        password: String(code),
        updated_at: new Date(Date.now()),
      },
    });

    if (userAfter.password === String(code)) {
      return 'Password reset successfully';
    }
  }

  async changePassword(data: ChangePasswordRequest, user_id: string): Promise<AuthResponse> {
    const user = await this.databaseService.User.findUnique({
      where: {
        user_id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found, access token is invalid');
    }

    if (user.password !== data.old_password) {
      throw new NotFoundException('Old password is incorrect');
    }

    const userAfter = await this.databaseService.User.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        password: data.password,
        updated_at: new Date(Date.now()),
      },
      include: {
        child: {
          orderBy: {
            expected_birth_date: 'desc',
          },
        },
      },
    });

    const access_token = await this.signAccessToken({ user_id: userAfter.user_id, role: userAfter.role });

    const hasMembership = await this.checkAccountMembership(userAfter.user_id);
    //create access token and refresh token then return
    const child = userAfter.child;
    return {
      access_token,
      // refresh_token,
      user: {
        user_id: userAfter.user_id,
        name: userAfter.name,
        role: userAfter.role,
        email: userAfter.email,
        // expected_birth_date: child[child.length - 1].expected_birth_date.toISOString(),
        has_membership: hasMembership,
        child: child,
      },
    };
  }

  async create(userCreateRequest: UserCreateRequestType): Promise<UserResponseType> {
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
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      },
    });

    if (userCreateRequest.membership_id) {
      const membership = await this.databaseService.MemberShip.findUnique({
        where: {
          membership_id: userCreateRequest.membership_id,
        },
      });

      if (!membership) {
        throw new NotFoundException('Membership not found');
      }

      const payment = await this.paymentService.createPaymentByAdminAtAddInAdminPage(membership.membership_id, user.user_id);
      return {
        ...user,
        membership_id: payment.membership.membership_id,
      };
    }
    return user;
  }

  async getUserById(id: string): Promise<UserResponseType> {
    const user = await this.databaseService.User.findUnique({
      where: {
        user_id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(updateUser: UserUpdateRequestType): Promise<UserResponseType> {
    const oldUser = await this.getUserById(updateUser.user_id!);

    if (!oldUser) {
      throw new NotFoundException('User not found');
    }

    const { membership_id, ...userDataToUpdate } = updateUser;

    const newUserUpdated = await this.databaseService.User.update({
      where: {
        user_id: updateUser.user_id,
      },
      omit: {
        password: true,
      },
      data: {
        ...userDataToUpdate,
        updated_at: new Date(Date.now()),
      },
    });

    if (updateUser.membership_id) {
      const membership = await this.databaseService.MemberShip.findUnique({
        where: {
          membership_id: membership_id,
        },
      });

      if (!membership) {
        throw new NotFoundException('Membership not found');
      }

      const payment = await this.paymentService.createPaymentByAdminAtAddInAdminPage(membership.membership_id, oldUser.user_id);
      return {
        ...newUserUpdated,
        membership_id: payment.membership.membership_id,
      };
    }
    return newUserUpdated;
  }

  async getUserProfile(id: string): Promise<UserProfileResponseType> {
    const user = await this.databaseService.User.findUnique({
      where: {
        user_id: id,
      },
      omit: {
        password: true,
      },
      include: {
        payment_history: true,
        child: {
          orderBy: {
            expected_birth_date: 'desc',
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      province: user.province,
      district: user.district,
      ward: user.ward,
      address: user.address,
      membership_id: user.payment_history?.at(user.payment_history.length - 1)?.membership_id,
      membership_buy_date: user.payment_history?.at(user.payment_history.length - 1)?.created_at,
      membership_expire_date: user.payment_history?.at(user.payment_history.length - 1)?.expired_at,
      child: user.child,
    };
  }

  async updateProfile(updateProfile: UserProfileUpdateType, userId): Promise<UserProfileResponseType> {
    await this.getUserById(userId);

    await this.databaseService.User.update({
      where: {
        user_id: userId,
      },
      data: {
        ...updateProfile,
        updated_at: new Date(Date.now()),
      },
    });

    return await this.getUserProfile(userId);
  }

  public async checkAccountMembership(userId: string): Promise<boolean> {
    const user = await this.databaseService.User.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        payment_history: {
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const membership = user.payment_history?.at(0)?.expired_at;

    console.log(user.payment_history?.at(0));
    if (membership) {
      const hasExpired = new Date(membership) < new Date();
      return !hasExpired;
    }
    return false;
  }

  public async getAccountMembership(userId: string): Promise<{
    membership_buy_date: Date | null;
    membership_expire_date: Date | null;
  } | null> {
    const user = await this.databaseService.User.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        payment_history: {
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const membership = user.payment_history?.at(0)?.expired_at;
    const createAt = user.payment_history?.at(0)?.created_at;

    console.log(user.payment_history?.at(0));
    if (membership) {
      const hasExpired = new Date(membership) < new Date();
      if (!hasExpired) {
        return {
          membership_buy_date: createAt ? new Date(createAt) : null,
          membership_expire_date: membership ? new Date(membership) : null,
        };
      }
    }
    return null;
  }

  async getAllUsersAtAdminPage(): Promise<UserIncludeMembershipType[]> {
    const re = await this.databaseService.User.findMany({
      omit: {
        password: true,
      },
      include: {
        payment_history: true,
      },
    });
    return re.map((user) => {
      const membershipDate = user.payment_history?.at(0)?.expired_at;

      if (membershipDate) {
        const hasExpired = new Date(membershipDate) < new Date();
        if (!hasExpired) {
          return {
            ...user,
            payment_history: undefined,
            membership_id: user.payment_history.at(0)?.membership_id,
          };
        }
      }
      return {
        ...user,
        payment_history: undefined,
      };
    });
  }

  async deleteUser(userId: string) {
    // Delete all posts and their related records first
    const posts = await this.postsService.getPostByUserId(userId);
    if (posts && posts.length > 0) {
      for (const post of posts) {
        // This should delete related comments and reactions
        await this.postsService.remove(post.post_id);
      }
    }

    // Delete tokens
    await this.databaseService.Token.deleteMany({
      where: { user_id: userId },
    });

    // Delete reminders
    await this.databaseService.Reminder.deleteMany({
      where: { user_id: userId },
    });

    // Delete notes
    await this.databaseService.Note.deleteMany({
      where: { user_id: userId },
    });

    // Delete payment history
    await this.databaseService.Payment.deleteMany({
      where: { user_id: userId },
    });

    // Delete child records and their related records
    const children = await this.childService.getAllChildren(userId);
    if (children && children.length > 0) {
      for (const child of children) {
        // Delete visit records first (which will cascade to visit_record_metric and media)
        await this.childService.deleteChild(child.child_id);

        // Now delete the child
        await this.databaseService.Child.delete({
          where: { child_id: child.child_id },
        });
      }
    }

    // Delete reactions that aren't handled by post deletion
    await this.databaseService.Reaction.deleteMany({
      where: { user_id: userId },
    });

    // Delete comments that aren't handled by post deletion
    await this.databaseService.Comment.deleteMany({
      where: { user_id: userId },
    });

    // Finally delete the user
    return this.databaseService.User.delete({
      where: { user_id: userId },
    });
  }
}
