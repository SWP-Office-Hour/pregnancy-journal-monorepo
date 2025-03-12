import { Injectable } from '@nestjs/common';
import { ChildCreateRequestType } from '../../../../../libs/contract/src/lib/child.contract';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ChildService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getChildById(child_id: string) {
    return await this.databaseService.Child.findUnique({ where: { child_id } });
  }

  async getAllChildren(user_id: string) {
    return await this.databaseService.Child.findMany({
      where: {
        user_id: user_id,
      },
    });
  }

  async createChild(userId: string, createChild: ChildCreateRequestType) {
    return await this.databaseService.Child.create({
      data: {
        user: {
          connect: {
            user_id: userId,
          },
        },
        ...createChild,
      },
    });
  }
}
