import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { RefreshTokenRequest, UserRole } from '@pregnancy-journal-monorepo/contract';
import { RequestWithJWT } from 'express';
import { ROLES_KEY } from '../utils/decorators/role.decorator';
import { JwtUtilsService } from '../utils/jwt/jwtUtils.service';

@Injectable()
export class AccessTokenAuthGuard implements CanActivate {
  constructor(
    private readonly jwtUtilsService: JwtUtilsService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithJWT>();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ForbiddenException('User access token authentication required');
    }

    try {
      const decoded_authorization = this.jwtUtilsService.verifyToken({
        token,
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET') || 'jwt_secret',
      });
      request.decoded_authorization = decoded_authorization;

      return true;
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
}

// @Injectable()
// export class EmailVerifyTokenAuthGuard implements CanActivate {
//   constructor(
//     private readonly jwtUtilsService: JwtUtilsService,
//     private readonly configService: ConfigService,
//   ) {}
//
//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest<RequestWithJWT>();
//     const token = request.query.email_verify_token;
//     if (!token) {
//       throw new ForbiddenException('User authentication required');
//     }
//     try {
//       const decoded_email_verify = this.jwtUtilsService.verifyToken({
//         token: token,
//         secret: this.configService.get<string>('JWT_EMAIL_TOKEN_SECRET'),
//       });
//       request.decoded_email_verify = decoded_email_verify;
//       return true;
//     } catch (e) {
//       throw new UnprocessableEntityException(e.message);
//     }
//   }
// }

@Injectable()
export class RefreshTokenAuthGuard implements CanActivate {
  constructor(
    private readonly jwtUtilsService: JwtUtilsService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = (request.body as RefreshTokenRequest).refresh_token;
    if (!token) {
      throw new ForbiddenException('User authentication required');
    }

    try {
      const decoded_refresh_token = this.jwtUtilsService.verifyToken({
        token,
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET') || 'jwt_secret',
      });
      const decoded_authorization = request.decoded_authorization;
      if (decoded_authorization) {
        if (decoded_authorization.user_id !== decoded_refresh_token.user_id) {
          throw new ForbiddenException('Invalid token');
        }
      }
      request.decoded_refresh_token = decoded_refresh_token;
      return true;
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
}

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtUtilsService: JwtUtilsService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) {
      return true;
    }
    try {
      const request = context.switchToHttp().getRequest<RequestWithJWT>();
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new ForbiddenException('User authentication required');
      }
      const decoded_authorization = this.jwtUtilsService.verifyToken({
        token,
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET') || 'jwt_secret',
      });
      if (!decoded_authorization) {
        throw new ForbiddenException('User role authentication required');
      }
      const isAllowed = requiredRoles.includes(decoded_authorization.role);
      if (!isAllowed) {
        throw new ForbiddenException("You don't have permission to access");
      }
      return isAllowed;
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
}

@Injectable()
export class IsLoggin implements CanActivate {
  constructor(
    private readonly jwtUtilsService: JwtUtilsService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithJWT>();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return true;
    }
    try {
      const decoded_authorization = this.jwtUtilsService.verifyToken({
        token,
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET') || 'jwt_secret',
      });
      request.decoded_authorization = decoded_authorization;
      return true;
    } catch (e) {
      return true;
    }
  }
}
