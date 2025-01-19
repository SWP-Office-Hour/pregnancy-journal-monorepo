import { UserRole } from '@pregnancy-journal-monorepo/contract';


export interface JwtPayload {
  user_id: string;
  role: UserRole;
}
