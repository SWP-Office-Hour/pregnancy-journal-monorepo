import { UserRole } from '@pregnancy-journal-monorepo/contract';

export interface User {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  status?: string;
  role?: UserRole;
  expected_birth_date?: string;
}
