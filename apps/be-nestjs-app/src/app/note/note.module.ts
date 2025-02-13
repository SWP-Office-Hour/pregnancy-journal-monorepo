import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

@Module({
  imports: [JwtUtilsModule],
  controllers: [NoteController],
  providers: [NoteService, DatabaseService],
})
export class NoteModule {}
