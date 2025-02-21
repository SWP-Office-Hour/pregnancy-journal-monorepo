import { z } from 'zod';

// Định nghĩa Role enum
export enum UserRole {
  ADMIN = 0,
  MEMBER = 1,
}

// Định nghĩa Status enum
export enum UserStatus {
  ACTIVE = 1,
  BANNED = 0,
}

// Tạo Zod schema cho role và status
export const userRoleSchema = z.nativeEnum(UserRole);
export const userStatusEnumSchema = z.nativeEnum(UserStatus);

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

// Định nghĩa ReminderType enum
export enum ReminderType {
  EVENT = 0,
  MEETING = 1,
}

export const reminderTypeSchema = z.nativeEnum(ReminderType);

// Định nghĩa PayStatus enum
export enum PayStatus {
  PENDING,
  SUCCESS,
  FAILED,
}

export const payStatusSchema = z.nativeEnum(PayStatus);

export enum PayMethod {
  PAYOS = 0,
}

export const payMethodSchema = z.nativeEnum(PayMethod);
