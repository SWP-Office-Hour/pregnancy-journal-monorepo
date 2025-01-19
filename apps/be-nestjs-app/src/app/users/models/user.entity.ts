import {
  UserRole,
  UserStatus,
} from '@pregnancy-journal-monorepo/contract';

export interface UserType {
  id?: string
  email: string
  password: string
  last_ovulation_date?: Date
  expected_birth_date?: Date
  membership_id?: string
  name: string
  phone: string
  province: string
  district: string
  ward: string
  address: string
  status?: UserStatus
  created_at?: Date
  updated_at?: Date
  role?: UserRole
}

export class UserEntity {
  id?: string
  email: string
  password: string
  last_ovulation_date?: Date
  expected_birth_date?: Date
  membership_id?: string
  name: string
  phone: string
  province: string
  district: string
  ward: string
  address: string
  status: UserStatus
  created_at: Date
  updated_at: Date
  role: UserRole

  constructor(userData: UserType) {
    this.id = userData.id;
    this.name = userData.name;
    this.email = userData.email;
    this.last_ovulation_date = userData.last_ovulation_date;
    this.expected_birth_date = userData.expected_birth_date;
    this.membership_id = userData.membership_id;
    this.province = userData.province;
    this.district = userData.district;
    this.ward = userData.ward;
    this.address = userData.address;
    this.phone = userData.phone;
    this.password = userData.password;
    this.created_at = userData.created_at || new Date();
    this.updated_at = userData.updated_at || new Date();
    this.role = userData.role || UserRole.MEMBER;
    this.status = userData.status || UserStatus.ACTIVE;
  }
}
