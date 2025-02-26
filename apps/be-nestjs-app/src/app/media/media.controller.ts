import { BadRequestException, Body, Controller, NotFoundException, Param, Query } from '@nestjs/common';
import { mediaContract, MediaResponse } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { FileService } from '../file/file.service';
import { MediaService } from './media.service';

@Controller()
export class MediaController {
  constructor(
    private readonly fileService: FileService,
    private readonly mediaService: MediaService,
  ) {}

  @TsRestHandler(mediaContract.updateMultiFiles)
  uploadFile(@Body() media: MediaResponse[], @Query() { post_id, record_id }: { post_id?: string; record_id?: string }) {
    return tsRestHandler(mediaContract.updateMultiFiles, async () => {
      if (!post_id && !record_id) {
        throw new BadRequestException('No post_id or record_id provided');
      }

      console.log(media);
      const { newMedias, deletedMedias } = await this.mediaService.updateWithRecordId({ media, record_id });

      if (deletedMedias.length === 0 && newMedias.length === 0) {
        return {
          status: 200 as const,
          body: [],
        };
      }
      const media_urls = await Promise.all(newMedias.map((m) => fetch(m.media_url)));
      const blobs = (await Promise.all(media_urls.map((m) => m.blob()))).map((blob) => {
        return {
          buffer: blob,
          filename: Date.now() + '-blob',
        };
      });

      const result: {
        post_id: string | null;
        media_id: string;
        media_url: string;
        created_at: Date;
        visit_record_id: string | null;
      }[] = [];

      // IF UPDATE MEDIA HAVE NEW MEDIA
      if (blobs) {
        const uploads = await Promise.all(
          blobs.map((blob) => {
            return this.fileService.uploadToR2Blob(blob.buffer, blob.filename);
          }),
        );
        if (!uploads) {
          throw new BadRequestException('Error uploading file');
        }

        if (uploads.length !== blobs.length) {
          throw new BadRequestException('Error uploading file with upload count not match');
        }

        if (uploads.some((upload) => !upload)) {
          throw new BadRequestException('Error uploading file with some upload failed');
        }

        if (post_id) {
          const create_result = await Promise.all(
            blobs.map((blob) =>
              this.mediaService.createWithPostId({
                media_url: blob.filename,
                post_id,
              }),
            ),
          );
          result.push(...create_result);
        } else if (record_id) {
          const create_result = await Promise.all(
            blobs.map((blob) =>
              this.mediaService.createWithRecordId({
                media_url: blob.filename,
                record_id,
              }),
            ),
          );
          result.push(...create_result);
        } else {
          throw new BadRequestException('No post_id or record_id provided');
        }
      }

      // IF UPDATE MEDIA HAVE DELETE MEDIA
      if (deletedMedias) {
        try {
          const deleted_result = await Promise.all(
            deletedMedias.map((m) => {
              return this.mediaService.remove(m.media_id);
            }),
          );
          await Promise.all(
            deletedMedias.map((m) => {
              return this.fileService.deleteFile(m.media_url);
            }),
          );
          result.push(...deleted_result);
        } catch (error) {
          throw new BadRequestException(error.message);
        }
      }

      return {
        status: 200 as const,
        body: result,
      };
    });
  }

  @TsRestHandler(mediaContract.updateFile)
  handleUploadFile(@Body() media: MediaResponse[], @Query() { post_id, record_id }: { post_id?: string; record_id?: string }) {
    return tsRestHandler(mediaContract.updateMultiFiles, async () => {
      if (!post_id && !record_id) {
        throw new BadRequestException('No post_id or record_id provided');
      }

      if (!media) {
        throw new BadRequestException('No media uploaded');
      }

      const media_urls = await Promise.all(media.map((m) => fetch(m.media_url)));
      const blobs = (await Promise.all(media_urls.map((m) => m.blob()))).map((blob) => {
        return {
          buffer: blob,
          filename: Date.now() + '-blob',
        };
      });

      const result: {
        post_id: string | null;
        media_id: string;
        media_url: string;
        created_at: Date;
        visit_record_id: string | null;
      }[] = [];

      // IF UPDATE MEDIA HAVE NEW MEDIA
      if (blobs) {
        const uploads = await Promise.all(
          blobs.map((blob) => {
            return this.fileService.uploadToR2Blob(blob.buffer, blob.filename);
          }),
        );
        if (!uploads) {
          throw new BadRequestException('Error uploading file');
        }

        if (uploads.length !== blobs.length) {
          throw new BadRequestException('Error uploading file with upload count not match');
        }

        if (uploads.some((upload) => !upload)) {
          throw new BadRequestException('Error uploading file with some upload failed');
        }

        if (post_id) {
          const create_result = await Promise.all(
            blobs.map((blob) =>
              this.mediaService.createWithPostId({
                media_url: blob.filename,
                post_id,
              }),
            ),
          );
          result.push(...create_result);
        } else if (record_id) {
          const create_result = await Promise.all(
            blobs.map((blob) =>
              this.mediaService.createWithRecordId({
                media_url: blob.filename,
                record_id,
              }),
            ),
          );
          result.push(...create_result);
        } else {
          throw new BadRequestException('No post_id or record_id provided');
        }
      }

      return {
        status: 200 as const,
        body: result,
      };
    });
  }

  // @TsRestHandler(mediaContract.updateFile)
  // @UseInterceptors(FileInterceptor('file'))
  // handleUpdateFile(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Query()
  //   {
  //     post_id,
  //     record_id,
  //   }: {
  //     post_id?: string;
  //     record_id?: string;
  //   },
  // ) {
  //   return tsRestHandler(mediaContract.updateFile, async () => {
  //     if (!post_id && !record_id) {
  //       throw new BadRequestException('No post_id or record_id provided');
  //     }
  //
  //     if (!file) {
  //       throw new BadRequestException('No file uploaded');
  //     }
  //
  //     const uniqueName = Date.now() + '-' + file.originalname;
  //     try {
  //       const upload = await this.fileService.uploadToR2(file, uniqueName);
  //       if (!upload) {
  //         throw new BadRequestException('Error uploading file');
  //       }
  //       let result: MediaResponse;
  //
  //       if (post_id) {
  //         result = await this.mediaService.createWithPostId({ media_url: uniqueName, post_id });
  //       } else if (record_id) {
  //         result = await this.mediaService.createWithRecordId({ media_url: uniqueName, record_id });
  //       } else {
  //         throw new BadRequestException('No post_id or record_id provided');
  //       }
  //
  //       console.log(file);
  //       if (file.path) await unlink(file.path);
  //       //xóa file sau khi upload
  //
  //       return {
  //         status: 200 as const,
  //         body: result,
  //       };
  //     } catch (error) {
  //       if (file.path) {
  //         await unlink(file.path); // Xóa file tạm nếu upload thất bại
  //       }
  //       throw new BadRequestException(error.message);
  //     }
  //   });
  // }

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
        const media = await this.mediaService.remove(filename);
        await this.fileService.deleteFile(media.media_url);

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
        throw new NotFoundException('Media not found');
      }
    });
  }
}
