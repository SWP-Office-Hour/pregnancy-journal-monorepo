import { Injectable } from '@nestjs/common';
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
