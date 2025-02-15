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
            user_id: userI,
          },
        },
      },
    });
  }

  async getAllNotes() {
    return await this.databaseService.Note.findMany();
  }

  async getNoteById(noteId: string) {
    const note = await this.databaseService.Note.findUnique({
      where: {
        id: noteId,
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
        id: note.id,
      },
    });

    if (!noteExist) {
      throw new NotFoundException('Note not found');
    }

    if (note.date) {
      const updatedNote = await this.databaseService.Note.update({
        where: {
          id: note.id,
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
        id: note.id,
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
        id: id,
      },
    });

    if (!deletedNote) {
      throw new NotFoundException('Note not found');
    }

    return deletedNote;
  }
}
