import { Injectable, NotFoundException } from '@nestjs/common';
import { MembershipCreateRequest, MembershipUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MembershipsService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createMembershipDto: MembershipCreateRequest) {
    return this.databaseService.MemberShip.create({
      data: {
        title: createMembershipDto.title,
        description: createMembershipDto.description,
        status: createMembershipDto.status,
        price: createMembershipDto.price,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      },
    });
  }

  findAll() {
    return this.databaseService.MemberShip.findMany();
  }

  async findOne(id: string) {
    const res = await this.databaseService.MemberShip.findUnique({
      where: {
        membership_id: id,
      },
    });
    if (!res) {
      throw new NotFoundException('Membership not found');
    }
    return res;
  }

  async update(updateMembershipDto: MembershipUpdateRequest) {
    await this.findOne(updateMembershipDto.membership_id);

    return this.databaseService.MemberShip.update({
      where: {
        membership_id: updateMembershipDto.membership_id,
      },
      data: updateMembershipDto,
    });
  }

  remove(id: string) {
    return this.databaseService.MemberShip.delete({
      where: {
        membership_id: id,
      },
    });
  }
}
