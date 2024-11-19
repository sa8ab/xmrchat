import { Injectable, Logger } from '@nestjs/common';
import { createReadStream } from 'fs';
import { Client } from 'minio';
import { Express } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
  private minioClient: Client;
  private logger = new Logger(MinioService.name);

  constructor(private configService: ConfigService) {
    this.minioClient = new Client({
      endPoint: this.configService.get('MINIO_URL'),
      port: +this.configService.get('MINIO_PORT'),
      useSSL: false,
      accessKey: this.configService.get('MINIO_USER'),
      secretKey: this.configService.get('MINIO_PASSWORD'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    bucketName: string,
    name: string,
  ) {
    const fileStream = createReadStream(file.path);

    return this.minioClient.putObject(bucketName, name, fileStream);
  }

  async createBucket(bucketName: string) {
    const exists = await this.minioClient.bucketExists(bucketName);

    if (!exists) {
      await this.minioClient.makeBucket(bucketName);
      this.logger.log(`Minio bucket ${bucketName} created.`);
    }
  }
}
