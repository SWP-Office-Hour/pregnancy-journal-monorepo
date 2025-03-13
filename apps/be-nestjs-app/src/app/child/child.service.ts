import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ChildCreateRequestType, ChildUpdateRequestType } from '../../../../../libs/contract/src/lib/child.contract';
import { DatabaseService } from '../database/database.service';
import { RecordsService } from '../records/records.service';
import { Child } from './entities/child.entity';

@Injectable()
export class ChildService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(forwardRef(() => RecordsService))
    private readonly recordsService: RecordsService,
  ) {}

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
        expected_birth_date: new Date(createChild.expected_birth_date),
      },
    });
  }

  async updateChild(updateChild: ChildUpdateRequestType) {
    // Create a copy of the update data
    const updateData: any = { ...updateChild };

    // Only create a Date if expected_birth_date has a value
    if (updateChild.expected_birth_date) {
      updateData.expected_birth_date = new Date(updateChild.expected_birth_date);
    }
    return await this.databaseService.Child.update({
      where: {
        child_id: updateChild.child_id,
      },
      data: updateData,
    });
  }

  async deleteChild(child_id: string) {
    const deleteRecord = await this.databaseService.Record.findMany({
      where: {
        child_id,
      },
    });

    for (const deleteRecordElement of deleteRecord) {
      await this.recordsService.deleteRecord(deleteRecordElement.visit_record_id);
    }

    return await this.databaseService.Child.delete({
      where: {
        child_id,
      },
    });
  }
}
