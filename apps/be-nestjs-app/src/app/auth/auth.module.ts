import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import {
  AccessTokenAuthGuard,
  // EmailVerifyTokenAuthGuard,
  IsLoggin,
  RefreshTokenAuthGuard,
  RoleAuthGuard,
} from './auth.guard';

@Module({
  imports: [JwtUtilsModule],
  providers: [
    AccessTokenAuthGuard,
    RoleAuthGuard,
    // EmailVerifyTokenAuthGuard,
    RefreshTokenAuthGuard,
    IsLoggin,
    ConfigModule,
  ],
})
export class AuthModule {}
