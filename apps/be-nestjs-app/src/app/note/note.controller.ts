import { Body, Controller, Param, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { noteContract, NoteCreateRequest, NoteUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { RequestWithJWT } from 'express';
import { AccessTokenAuthGuard } from '../auth/auth.guard';
import { NoteService } from './note.service';

@Controller()
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(noteContract.create)
  handleCreate(@Body() note: NoteCreateRequest, @Req() req: RequestWithJWT) {
    return tsRestHandler(noteContract.create, async () => {
      if (!req.decoded_authorization) {
        throw new UnauthorizedException('UnAuthorized');
      }
      const userId = req.decoded_authorization.user_id;

      const result = await this.noteService.createNote({
        note: note,
        userId: userId,
      });
      return {
        status: 200,
        body: result,
      };
    });
  }

  @TsRestHandler(noteContract.getAll)
  handleGetAll() {
    return tsRestHandler(noteContract.getAll, async () => {
      const result = await this.noteService.getAllNotes();
      return {
        status: 200,
        body: result,
      };
    });
  }

  @TsRestHandler(noteContract.getOne)
  handleGetOne(@Param('id') id: string) {
    return tsRestHandler(noteContract.getOne, async () => {
      const result = await this.noteService.getNoteById(id);
      return {
        status: 200,
        body: result,
      };
    });
  }

  @TsRestHandler(noteContract.update)
  handleUpdate(@Body() note: NoteUpdateRequest) {
    return tsRestHandler(noteContract.update, async () => {
      const result = await this.noteService.updateNoteById(note);
      return {
        status: 200,
        body: result,
      };
    });
  }

  @TsRestHandler(noteContract.delete)
  handleDelete(@Param('id') id: string) {
    return tsRestHandler(noteContract.delete, async () => {
      const result = await this.noteService.deleteNoteById(id);
      console.log(result);
      return {
        status: 200,
        body: result,
      };
    });
  }
}
