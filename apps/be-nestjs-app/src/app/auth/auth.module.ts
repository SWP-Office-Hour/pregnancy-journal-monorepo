import { Module } from '@nestjs/common';
import {
  AccessTokenAuthGuard,
  EmailVerifyTokenAuthGuard,
  IsLoggin,
  RefreshTokenAuthGuard,
  RoleAuthGuard,
} from './auth.guard';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';

@Module({
  imports: [JwtUtilsModule],
  providers: [
    AccessTokenAuthGuard,
    RoleAuthGuard,
    EmailVerifyTokenAuthGuard,
    RefreshTokenAuthGuard,
    IsLoggin,
  ],
})
export class AuthModule {}
