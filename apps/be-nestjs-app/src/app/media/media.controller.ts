import {
  BadRequestException,
  Controller,
  NotFoundException,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { mediaContract } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { Express } from 'express';
import { unlink } from 'fs/promises';
import { FileService } from '../file/file.service';

@Controller()
export class MediaController {
  constructor(private readonly fileService: FileService) {}

  @TsRestHandler(mediaContract.updateFile)
  @UseInterceptors(FileInterceptor('file'))
  handleUpdateFile(@UploadedFile() file: Express.Multer.File) {
    return tsRestHandler(mediaContract.updateFile, async () => {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
      const uniqueName = Date.now() + '-' + file.originalname;
      try {
        await this.fileService.uploadToR2(file, uniqueName);
        await unlink(file.path);
        //xóa file sau khi upload

        const url = await this.fileService.createPresignedUrl(uniqueName);
        return {
          status: 200 as const,
          body: {
            message: 'File uploaded successfully',
            name: uniqueName,
            url: url,
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

  // @TsRestHandler(mediaContract.getFile)
  // handleGetFile(@Param('filename') filename: string, @Res() res) {
  //   return tsRestHandler(mediaContract.getFile, async () => {
  //     try {
  //       res.sendFile(await this.fileService.sendFile(filename));
  //       return {
  //         status: 200 as const,
  //         body: 'File sent successfully',
  //       };
  //     } catch (error) {
  //       throw new NotFoundException('File not found');
  //     }
  //   });
  // }

  @TsRestHandler(mediaContract.deleteFile)
  handleDeleteFile(@Param('filename') filename: string) {
    return tsRestHandler(mediaContract.deleteFile, async () => {
      try {
        await this.fileService.deleteFile(filename);

        //xóa ở thư mục images
        // await unlink(join(__dirname, '..', '..', 'images', filename));
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

  @TsRestHandler(mediaContract.getLink)
  handleGetLink(@Param('filename') filename: string) {
    return tsRestHandler(mediaContract.getLink, async () => {
      try {
        const link = await this.fileService.createPresignedUrl(filename);
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
