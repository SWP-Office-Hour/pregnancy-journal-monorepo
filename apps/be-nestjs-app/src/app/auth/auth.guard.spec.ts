import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtUtilsService } from '../utils/jwt/jwtUtils.service';
import { AccessTokenAuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@pregnancy-journal-monorepo/contract';

describe('AccessTokenAuthGuard', () => {
  let guard: AccessTokenAuthGuard;
  let jwtUtilsService: JwtUtilsService;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService();
    jwtUtilsService = new JwtUtilsService(jwtService, configService);
    configService = new ConfigService();
    guard = new AccessTokenAuthGuard(jwtUtilsService, configService);
  });

  it('should allow access if token is valid', () => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer valid_token' },
          decoded_authorization: {},
        }),
      }),
    } as unknown as ExecutionContext;

    jest
      .spyOn(jwtUtilsService, 'verifyToken')
      .mockReturnValue({ user_id: '123', role: UserRole.MEMBER });
    jest.spyOn(configService, 'get').mockReturnValue('secret');

    expect(guard.canActivate(context)).toEqual(true);
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer invalid_token' },
        }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(jwtUtilsService, 'verifyToken').mockImplementation(() => {
      throw new Error('Invalid token');
    });
    jest.spyOn(configService, 'get').mockReturnValue('secret');

    expect(() => guard.canActivate(context)).toThrow('Invalid token');
  });
});
