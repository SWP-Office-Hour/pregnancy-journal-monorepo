import { UserRole, UserTypeFromContract } from '@pregnancy-journal-monorepo/contract';

let test: UserTypeFromContract;

export interface User {
  user_id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  status?: string;
  role?: UserRole;
  expected_birth_date?: string;
}
