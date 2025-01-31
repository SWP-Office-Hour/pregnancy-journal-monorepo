import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { membershipCreateReq, membershipUpdateReq } from '@pregnancy-journal-monorepo/contract';

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

  async findOne(id: string) {
    const res = await this.databaseService.MemberShip.findUnique({
      where: {
        id: id,
      },
    });
    if (!res) {
      throw new NotFoundException('Membership not found');
    }
    return res;
  }

  async update(updateMembershipDto: membershipUpdateReq) {
    await this.findOne(updateMembershipDto.id);

    return this.databaseService.MemberShip.update({
      where: {
        id: updateMembershipDto.id,
      },
      data: updateMembershipDto,
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
