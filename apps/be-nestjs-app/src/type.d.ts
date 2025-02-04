import { JwtPayload } from './auth/auth.interface';
import { Request } from 'express';
import { UserRole } from '@pregnancy-journal-monorepo/contract';
// Declare the type of the user object

declare module 'express' {
  interface RequestWithJWT extends Request {
    decoded_authorization?: JwtPayload;
    decoded_refresh_token?: JwtPayload;
    decoded_email_verify?: JwtPayload;
    decoded_forgot_password?: JwtPayload;
  }
}
