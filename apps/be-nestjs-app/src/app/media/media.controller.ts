import { BadRequestException, Controller, NotFoundException, Param, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { mediaContract, MediaResponse } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { Express } from 'express';
import { unlink } from 'fs/promises';
import { FileService } from '../file/file.service';
import { MediaService } from './media.service';

@Controller()
export class MediaController {
  constructor(
    private readonly fileService: FileService,
    private readonly mediaService: MediaService,
  ) {}

  @TsRestHandler(mediaContract.updateFile)
  @UseInterceptors(FileInterceptor('file'))
  handleUpdateFile(
    @UploadedFile() file: Express.Multer.File,
    @Query()
    {
      post_id,
      record_id,
    }: {
      post_id?: string;
      record_id?: string;
    },
  ) {
    return tsRestHandler(mediaContract.updateFile, async () => {
      if (!post_id && !record_id) {
        throw new BadRequestException('No post_id or record_id provided');
      }

      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      const uniqueName = Date.now() + '-' + file.originalname;
      try {
        await this.fileService.uploadToR2(file, uniqueName);
        console.log(file);
        // if (file) await unlink(file.path);
        //xóa file sau khi upload

        const url = await this.fileService.createPresignedUrl(uniqueName);
        let result: MediaResponse;
        if (post_id) {
          result = await this.mediaService.createWithPostId({ media_url: url, post_id });
        } else if (record_id) {
          result = await this.mediaService.createWithRecordId({ media_url: url, record_id });
        }

        return {
          status: 200 as const,
          body: result,
        };
      } catch (error) {
        if (file.path) {
          await unlink(file.path); // Xóa file tạm nếu upload thất bại
        }
        console.log(error);
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
  handleDeleteFile(@Param('id') filename: string) {
    return tsRestHandler(mediaContract.deleteFile, async () => {
      try {
        await this.fileService.deleteFile(filename);
        await this.mediaService.remove(filename);
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

  // @TsRestHandler(mediaContract.getLink)
  // handleGetLink(@Param('filename') filename: string) {
  //   return tsRestHandler(mediaContract.getLink, async () => {
  //     try {
  //       const link = await this.fileService.createPresignedUrl(filename);
  //       return {
  //         status: 200 as const,
  //         body: {
  //           link,
  //         },
  //       };
  //     } catch (error) {
  //       throw new NotFoundException('File not found');
  //     }
  //   });
  // }

  @TsRestHandler(mediaContract.getLink)
  handleGetLink(@Param('id') filename: string) {
    return tsRestHandler(mediaContract.getLink, async () => {
      try {
        const link = await this.mediaService.findOne(filename);
        return {
          status: 200 as const,
          body: link,
        };
      } catch (error) {
        throw new NotFoundException('File not found');
      }
    });
  }
}
