import { Injectable, NotFoundException } from '@nestjs/common';
import { ChildCreateRequestType, ChildUpdateRequestType } from '../../../../../libs/contract/src/lib/child.contract';
import { DatabaseService } from '../database/database.service';
import { Child } from './entities/child.entity';

@Injectable()
export class ChildService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getChildById(child_id: string): Promise<Child> {
    const child = await this.databaseService.Child.findUnique({ where: { child_id } });
    if (!child) {
      throw new NotFoundException('Child not found');
    }
    return child;
  }

  async getAllChildren(user_id: string): Promise<Child[]> {
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

  async updateChild(updateChild: ChildUpdateRequestType) {
    return await this.databaseService.Child.update({
      where: {
        child_id: updateChild.child_id,
      },
      data: updateChild,
    });
  }

  async deleteChild(child_id: string) {
    const deleteRecord = await this.databaseService.Record.findMany({
      where: {
        child_id,
      },
    });

    if (deleteRecord.length > 0) {
      await this.databaseService.Record.deleteMany({
        where: {
          child_id,
        },
      });
    }

    return await this.databaseService.Child.delete({
      where: {
        child_id,
      },
    });
  }
}
