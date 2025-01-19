import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayload } from './jwt.interface';

@Injectable()
export class JwtUtilsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signToken({
    payload,
    options = {
      algorithm: 'HS256',
    },
    secret = this.configService.get<string>('JWT_SECRET'),
  }: {
    payload: JwtPayload;
    options: JwtSignOptions;
    secret: string;
  }) {
    options.secret = secret;
    return this.jwtService.signAsync(payload, options);
  }

  verifyToken({ token, secret }: { token: string; secret: string }) {
    return this.jwtService.verify<JwtPayload>(token, { secret });
  }

  generateNewRefreshTokenExpiry({
    created_at,
    old_expires_in,
  }: {
    created_at: Date;
    old_expires_in: string;
  }) {
    const created_time = created_at.getTime();
    const now = new Date().getTime();
    const expiresIn =
      Number(old_expires_in.replace('d', '')) * 24 * 60 * 60 * 1000;
    const newExpiresIn = ((created_time + expiresIn - now) / 1000).toFixed(0);
    return `${newExpiresIn}s`;
  }
}
