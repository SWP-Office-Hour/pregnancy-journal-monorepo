import { z } from 'zod';

// Định nghĩa Role enum
export enum UserRole {
  ADMIN,
  MEMBER,
}

// Định nghĩa Status enum
export enum UserStatus {
  ACTIVE = 1,
  BANNED = 2,
}

// Tạo Zod schema cho role và status
export const UserRoleSchema = z.nativeEnum(UserRole);
export const StatusEnumSchema = z.nativeEnum(UserStatus);

// Định nghĩa Status trạng thái enum
export enum Status {
  ACTIVE = 1,
  INACTIVE = 0,
}

// Định nghĩa membershipDay enum
export enum membershipDay {
  MONTHLY = 30,
  YEARLY = 365,
}

export const statusSchema = z.nativeEnum(Status);
export const membershipDaySchema = z.nativeEnum(membershipDay);
