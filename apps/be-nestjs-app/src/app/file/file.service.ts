import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';
import { constants, createReadStream } from 'fs';
import { access, unlink } from 'fs/promises';
import { IncomingMessage } from 'http';
import { join } from 'path';

@Injectable()
export class FileService {
  private s3Client: S3Client;
  private readonly uploadPath = join(__dirname, '..', '..', 'images');

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get('CLOUDFLARE_ENDPOINT');
    const accessKey = this.configService.get('CLOUDFLARE_ACCESS');
    const secretKey = this.configService.get('CLOUDFLARE_SECRET');

    if (!endpoint || !accessKey || !secretKey) {
      throw new BadRequestException('Cloudflare credentials not set');
    } else {
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: endpoint,
        credentials: {
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
        },
      });
    }
  }

  async uploadToR2(file: Express.Multer.File, filename: string) {
    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.configService.get('CLOUDFLARE_BUCKET'),
          Key: filename,
          Body: createReadStream(file.path),
        },
      });
      await upload.done();
      return true;
    } catch (error) {
      console.error('Error uploading to R2:', error);
      throw error;
    }
  }

  async getFile(filename: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.configService.get('CLOUDFLARE_BUCKET'),
        Key: filename,
      });

      const response = await this.s3Client.send(command);
      return response.Body;
    } catch (error) {
      console.error('Error getting file from R2:', error);
      throw error;
    }
  }

  // async downloadFile(filename: string) {
  //   try {
  //     const file = await this.getFile(filename);
  //     const buffer = await streamToBuffer(file as IncomingMessage);
  //
  //     const filePath = join(this.uploadPath, filename);
  //
  //     // Ensure the upload directory exists
  //     mkdirSync(this.uploadPath, { recursive: true });
  //
  //     const writeStream = createWriteStream(filePath);
  //     writeStream.write(buffer);
  //     writeStream.end();
  //     // writeStream.on('finish', () => {
  //     //   res.send({ message: 'File saved successfully', path: filePath });
  //     // });
  //     writeStream.on('error', (error) => {
  //       throw new BadRequestException('Could not save file');
  //     });
  //     return filePath;
  //   } catch (error) {
  //     console.error('Error downloading file:', error);
  //     throw error;
  //   }
  // }

  async deleteFile(filename: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.configService.get('CLOUDFLARE_BUCKET'),
        Key: filename,
      });
      // await this.deleteLocalFile(filename);
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting file from R2:', error);
      throw error;
    }
  }

  //hàm này dùng để tạo presign gửi đi khi upload (cũ bỏ ko làm cách này nữa)
  createPresignedUrlWithClient = () => {
    const bucket = this.configService.get('CLOUDFLARE_BUCKET');
    const key = this.configService.get('CLOUDFLARE_SECRET');

    const client = new S3Client({ region: 'auto' });
    const command = new PutObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(client, command, { expiresIn: 3600 });
  };

  // async getFilePath(filename: string) {
  //   const filepath = await this.downloadFile(filename);
  //   console.log(filepath);
  //   return join(this.uploadPath, filepath);
  // }

  async deleteLocalFile(fileName: string) {
    try {
      const filePath = join(this.uploadPath, fileName);
      await access(filePath, constants.F_OK);
      await unlink(filePath);
      return true;
    } catch (error) {
      console.error('Error deleting local file:', error);
      throw error;
    }
  }

  //lấy cái link presign để gửi đi khi mún download file, dùng tấm ảnh
  async getImageUrl(filename: string) {
    const command = new GetObjectCommand({
      Bucket: this.configService.get('CLOUDFLARE_BUCKET'),
      Key: filename,
    });
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 604800 });
    return url;
  }
}

function streamToBuffer(stream: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}
