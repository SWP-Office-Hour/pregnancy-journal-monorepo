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

  get Category() {
    return this.prisma.category;
  }

  get Tag() {
    return this.prisma.tag;
  }

  get Standard() {
    return this.prisma.standard;
  }

  get Metric() {
    return this.prisma.metric;
  }

  get Hospital() {
    return this.prisma.hospital;
  }

  get Blog() {
    return this.prisma.blog;
  }

  get BlogOnTag() {
    return this.prisma.blog_tag;
  }

  get Media() {
    return this.prisma.media;
  }
}
