import { Body, Controller, Param, Req, UseGuards } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { RequestWithJWT } from 'express';
import { childContract, ChildCreateRequestType, ChildUpdateRequestType } from '../../../../../libs/contract/src/lib/child.contract';
import { AccessTokenAuthGuard } from '../auth/auth.guard';
import { ChildService } from './child.service';

@Controller()
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(childContract.create)
  handleCreateChild(@Body() createChildDto: ChildCreateRequestType, @Req() req: RequestWithJWT) {
    return tsRestHandler(childContract.create, async () => {
      if (!req.decoded_authorization) {
        return { status: 401, body: { message: 'Unauthorized' } };
      }
      const userId = req.decoded_authorization.user_id;

      const result = await this.childService.createChild(userId, createChildDto);
      return { status: 200, body: result };
    });
  }

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(childContract.getAll)
  handleGetAllChildren(@Req() req: RequestWithJWT) {
    return tsRestHandler(childContract.getAll, async () => {
      if (!req.decoded_authorization) {
        return { status: 401, body: { message: 'Unauthorized' } };
      }
      const userId = req.decoded_authorization.user_id;
      const result = await this.childService.getAllChildren(userId);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(childContract.update)
  handleUpdateChild(@Body() updateChildDto: ChildUpdateRequestType) {
    return tsRestHandler(childContract.update, async () => {
      const result = await this.childService.updateChild(updateChildDto);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(childContract.getOne)
  handleGetChildById(@Param('id') childId: string) {
    return tsRestHandler(childContract.getOne, async () => {
      const result = await this.childService.getChildById(childId);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(childContract.delete)
  handleDeleteChild(@Param('id') childId: string) {
    return tsRestHandler(childContract.delete, async () => {
      const result = await this.childService.deleteChild(childId);
      return { status: 200, body: result };
    });
  }
}
