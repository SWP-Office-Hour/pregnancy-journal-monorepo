import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService {
  private readonly prisma = new PrismaClient();

  get Token() {
    return this.prisma.token;
  }

  get User() {
    return this.prisma.user;
  }

  get MemberShip() {
    return this.prisma.membership;
  }

  get Reminder() {
    return this.prisma.reminder;
  }

  get Tag() {
    return this.prisma.tag;
  }

  get Note() {
    return this.prisma.note;
  }

  get Comment() {
    return this.prisma.comment;
  }

  get Hospital() {
    return this.prisma.hospital;
  }

  get Metric() {
    return this.prisma.metric;
  }

  get Standard() {
    return this.prisma.standard;
  }
}
