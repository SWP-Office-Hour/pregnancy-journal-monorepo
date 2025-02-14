import { Body, Controller, Param } from '@nestjs/common';
import { membershipContract, membershipCreateRequest, membershipUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { MembershipsService } from './memberships.service';

@Controller()
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @TsRestHandler(membershipContract.create)
  handleCreateMembership(@Body() body: membershipCreateRequest) {
    return tsRestHandler(membershipContract.create, async () => {
      const membership = await this.membershipsService.create(body);
      return { status: 200, body: membership };
    });
  }

  @TsRestHandler(membershipContract.getAll)
  handleFindAllMemberships() {
    return tsRestHandler(membershipContract.getAll, async () => {
      const memberships = await this.membershipsService.findAll();
      return { status: 200, body: memberships };
    });
  }

  @TsRestHandler(membershipContract.getOne)
  handleFindOneMembership(@Param('id') id: string) {
    return tsRestHandler(membershipContract.getOne, async () => {
      const membership = await this.membershipsService.findOne(id);
      return { status: 200, body: membership };
    });
  }

  @TsRestHandler(membershipContract.update)
  handleUpdateMembership(@Body() body: membershipUpdateRequest) {
    return tsRestHandler(membershipContract.update, async () => {
      const membership = await this.membershipsService.update(body);
      return { status: 200, body: membership };
    });
  }

  @TsRestHandler(membershipContract.delete)
  handleDeleteMembership(@Param('id') id: string) {
    return tsRestHandler(membershipContract.delete, async () => {
      const deleted = await this.membershipsService.remove(id);
      return { status: 200, body: deleted };
    });
  }
}
