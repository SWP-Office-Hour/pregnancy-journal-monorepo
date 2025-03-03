import { UserRole, UserStatus } from '@pregnancy-journal-monorepo/contract';

export interface User {
  user_id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: UserRole;
  status?: UserStatus;
  onlineStatus?: string;
  expected_birth_date?: string;
}

//HOÀNG TRY TO FIX BUT DON'T UNDERSTAND
//
// let test: UserTypeFromContract;
// import { UserTypeFromContract } from '@pregnancy-journal-monorepo/contract';
//
// export interface User extends UserTypeFromContract {
//   avatar?: string;
// }
