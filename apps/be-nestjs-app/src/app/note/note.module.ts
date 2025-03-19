import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

@Module({
  imports: [JwtUtilsModule, DatabaseModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
