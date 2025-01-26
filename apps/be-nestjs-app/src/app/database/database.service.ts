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
}
