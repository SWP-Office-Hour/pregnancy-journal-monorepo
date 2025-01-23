import { BadRequestException, Injectable } from '@nestjs/common';
import { createReadStream, constants, mkdirSync, createWriteStream } from 'fs';
import { Upload } from '@aws-sdk/lib-storage';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { unlink, access } from 'fs/promises';
import { join } from 'path';
import { IncomingMessage } from 'http';

@Injectable()
export class FileService {
  private s3Client: S3Client;
  private readonly uploadPath = join(__dirname, '..', '..', 'images');

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.configService.get('CLOUDFLARE_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get('CLOUDFLARE_ACCESS'),
        secretAccessKey: this.configService.get('CLOUDFLARE_SECRET'),
      },
    });
  }

  async uploadToR2(filePath: string, filename: string) {
    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.configService.get('CLOUDFLARE_BUCKET'),
          Key: filename,
          Body: createReadStream(filePath),
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

  async downloadFile(filename: string) {
    try {
      const file = await this.getFile(filename);
      const buffer = await streamToBuffer(file as IncomingMessage);

      const filePath = join(this.uploadPath, filename);

      // Ensure the upload directory exists
      mkdirSync(this.uploadPath, { recursive: true });

      const writeStream = createWriteStream(filePath);
      writeStream.write(buffer);
      writeStream.end();
      // writeStream.on('finish', () => {
      //   res.send({ message: 'File saved successfully', path: filePath });
      // });
      writeStream.on('error', (error) => {
        throw new BadRequestException('Could not save file');
      });
      return filePath;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

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

  async getFilePath(filename: string) {
    const filepath = await this.downloadFile(filename);
    console.log(filepath);
    return join(this.uploadPath, filepath);
  }

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

  async sendFile(nameFile: string) {
    const imagePath = await this.downloadFile(nameFile);
    console.log(imagePath);
    return imagePath;
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
