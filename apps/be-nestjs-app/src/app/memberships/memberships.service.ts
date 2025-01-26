import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  membershipCreateReq,
  membershipUpdateReq,
} from '@pregnancy-journal-monorepo/contract';

@Injectable()
export class MembershipsService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createMembershipDto: membershipCreateReq) {
    return this.databaseService.MemberShip.create({
      data: {
        title: createMembershipDto.title,
        description: createMembershipDto.description,
        status: createMembershipDto.status,
        price: createMembershipDto.price,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  findAll() {
    return this.databaseService.MemberShip.findMany();
  }

  findOne(id: string) {
    return this.databaseService.MemberShip.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(updateMembershipDto: membershipUpdateReq) {
    const cur = this.findOne(updateMembershipDto.id);
    if (!cur) {
      throw new Error('Membership not found');
    }

    const updateData = {
      title: updateMembershipDto.title,
      description: updateMembershipDto.description,
      status: updateMembershipDto.status,
      price: updateMembershipDto.price,
      updated_at: new Date(),
    };

    // Xóa các trường có giá trị null hoặc rỗng
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === null || updateData[key] === '') {
        delete updateData[key];
      }
    });

    return this.databaseService.MemberShip.update({
      where: {
        id: updateMembershipDto.id,
      },
      data: updateData,
    });
  }

  remove(id: string) {
    return this.databaseService.MemberShip.delete({
      where: {
        id: id,
      },
    });
  }
}
