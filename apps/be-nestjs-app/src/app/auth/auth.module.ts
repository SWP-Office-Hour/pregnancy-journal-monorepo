import { Module } from '@nestjs/common';
import {
  AccessTokenAuthGuard,
  EmailVerifyTokenAuthGuard,
  IsLoggin,
  RefreshTokenAuthGuard,
  RoleAuthGuard,
} from './auth.guard';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [JwtUtilsModule],
  providers: [
    AccessTokenAuthGuard,
    RoleAuthGuard,
    EmailVerifyTokenAuthGuard,
    RefreshTokenAuthGuard,
    IsLoggin,
    ConfigModule,
  ],
})
export class AuthModule {}
