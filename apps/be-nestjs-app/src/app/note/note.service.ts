import { Injectable, NotFoundException } from '@nestjs/common';
import { NoteCreateRequest, NoteResponse, NoteUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class NoteService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createNote({ note, userId }: { note: NoteCreateRequest; userId: string }): Promise<NoteResponse> {
    //kiểm tra coi user có tồn tại không
    const user = await this.databaseService.User.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.databaseService.Note.create({
      data: {
        title: note.title,
        content: note.content,
        date: new Date(note.date),
        status: note.status,
        user: {
          connect: {
            user_id: userId,
          },
        },
      },
    });
  }

  async getAllNotes(user_id: string) {
    return await this.databaseService.Note.findMany({
      where: {
        user_id: user_id,
      },
    });
  }

  async getNoteById(noteId: string) {
    const note = await this.databaseService.Note.findUnique({
      where: {
        note_id: noteId,
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async updateNoteById(note: NoteUpdateRequest) {
    const noteExist = await this.databaseService.Note.findUnique({
      where: {
        note_id: note.note_id,
      },
    });

    if (!noteExist) {
      throw new NotFoundException('Note not found');
    }

    if (note.date) {
      const updatedNote = await this.databaseService.Note.update({
        where: {
          note_id: note.note_id,
        },
        data: {
          title: note.title,
          content: note.content,
          date: new Date(note.date),
          status: note.status,
        },
      });

      if (!updatedNote) {
        throw new NotFoundException('Note not found');
      }

      return updatedNote;
    }

    return await this.databaseService.Note.update({
      where: {
        note_id: note.note_id,
      },
      data: {
        title: note.title,
        content: note.content,
        status: note.status,
      },
    });
  }

  async deleteNoteById(id: string) {
    await this.getNoteById(id);

    const deletedNote = await this.databaseService.Note.delete({
      where: {
        note_id: id,
      },
    });

    if (!deletedNote) {
      throw new NotFoundException('Note not found');
    }

    return deletedNote;
  }
}
