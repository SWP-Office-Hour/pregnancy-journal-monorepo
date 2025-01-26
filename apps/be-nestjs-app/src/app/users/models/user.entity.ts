import { UserRole, UserStatus } from '@pregnancy-journal-monorepo/contract';

interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  lastOvulationDate?: Date;
  expectedBirthDate?: Date;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  role?: UserRole;
  status?: UserStatus;
  created_at?: Date;
  updated_at?: Date;
}

export class UserEntity {
  id?: string;
  name: string;
  email: string;
  password: string;
  last_ovulation_date?: Date;
  expected_birth_date?: Date;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  role: UserRole;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;

  constructor(userData: User) {
    this.id = userData.id;
    this.name = userData.name;
    this.phone = userData.phone;
    this.password = userData.password;
    this.email = userData.email;
    this.last_ovulation_date = userData.lastOvulationDate;
    this.expected_birth_date = userData.expectedBirthDate;
    this.province = userData.province;
    this.district = userData.district;
    this.ward = userData.ward;
    this.address = userData.address;
    this.created_at = userData.created_at || new Date();
    this.updated_at = userData.updated_at || new Date();
    this.role = userData.role || UserRole.MEMBER;
    this.status = userData.status || UserStatus.ACTIVE;
  }
}
