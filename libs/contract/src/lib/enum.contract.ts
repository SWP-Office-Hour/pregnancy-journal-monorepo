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

export enum ReminderColor {
  FOLLOW_UP_MEETING_COLOR = 'FFA0BF',
  USER_CREATED_EVENT_COLOR = 'BFD4FF',
  CUSTOM_ONE = 'D8C4FF',
  CUSTOM_TWO = 'FFD4A0',
  CUSTOM_THREE = 'FFBFCB',
  CUSTOM_FOUR = 'CAFFBF',
  CUSTOM_FIVE = 'FFD4BF',
  CUSTOM_SIX = 'A0C4FF',
  CUSTOM_SEVEN = 'A0FFBF',
  CUSTOM_EIGHT = 'FFBFA0',
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
  USER_CREATED_EVENT = 0,
  FOLLOW_UP_MEETING = 1,
  USER_DUE_DATE = 2,
}

export const reminderTypeSchema = z.nativeEnum(ReminderType);

// Định nghĩa PayStatus enum
export enum PayStatus {
  SUCCESS = 1,
  FAILED = 0,
}

export const payStatusSchema = z.nativeEnum(PayStatus);

export enum PayMethod {
  PAYOS = 0,
}

export const payMethodSchema = z.nativeEnum(PayMethod);
export enum Gender {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2,
}

export const genderSchema = z.nativeEnum(Gender);
