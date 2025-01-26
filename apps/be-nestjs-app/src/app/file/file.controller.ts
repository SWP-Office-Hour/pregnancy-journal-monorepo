import {
  BadRequestException,
  Controller,
  NotFoundException,
  Param,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { fileContract } from '@pregnancy-journal-monorepo/contract';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @TsRestHandler(fileContract.updateFile)
  @UseInterceptors(FileInterceptor('file'))
  handleUpdateFile(@UploadedFile() file: Express.Multer.File) {
    return tsRestHandler(fileContract.updateFile, async () => {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
      const uniqueName = Date.now() + '-' + file.originalname;
      try {
        await this.fileService.uploadToR2(file.path, uniqueName);
        await unlink(file.path); //xóa file tạm sau khi upload
        return {
          status: 200 as const,
          body: {
            message: 'File uploaded successfully',
            name: uniqueName,
          },
        };
      } catch (error) {
        if (file.path) {
          await unlink(file.path); // Xóa file tạm nếu upload thất bại
        }
        throw new BadRequestException('Could not upload file');
      }
    });
  }

  @TsRestHandler(fileContract.getFile)
  handleGetFile(@Param('filename') filename: string, @Res() res) {
    return tsRestHandler(fileContract.getFile, async () => {
      try {
        res.sendFile(await this.fileService.sendFile(filename));
        return {
          status: 200 as const,
          body: 'File sent successfully',
        };
      } catch (error) {
        throw new NotFoundException('File not found');
      }
    });
  }

  @TsRestHandler(fileContract.deleteFile)
  handleDeleteFile(@Param('filename') filename: string) {
    return tsRestHandler(fileContract.deleteFile, async () => {
      try {
        await this.fileService.deleteFile(filename);

        //xóa ở thư mục images
        await unlink(join(__dirname, '..', '..', 'images', filename));
        return {
          status: 200 as const,
          body: {
            message: 'File deleted successfully',
          },
        };
      } catch (error) {
        throw new NotFoundException('File not found');
      }
    });
  }

  @TsRestHandler(fileContract.getLink)
  handleGetLink(@Param('filename') filename: string) {
    return tsRestHandler(fileContract.getLink, async () => {
      try {
        const link = await this.fileService.createPresignedUrlWithClient();
        return {
          status: 200 as const,
          body: {
            link,
          },
        };
      } catch (error) {
        throw new NotFoundException('File not found');
      }
    });
  }
}
