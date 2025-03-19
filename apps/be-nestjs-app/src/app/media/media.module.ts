import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DatabaseModule } from '../database/database.module';
import { FileService } from '../file/file.service';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
    DatabaseModule,
  ],
  controllers: [MediaController],
  providers: [MediaService, FileService],
  exports: [MediaService, FileService],
})
export class MediaModule {}
