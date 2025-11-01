import { Injectable, Logger } from '@nestjs/common';
import { createReadStream } from 'fs';
import { Client } from 'minio';
import { Express } from 'express';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'form-data';

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

  async uploadFile(file: Buffer | Readable, bucketName: string, name: string) {
    await this.createBucket(bucketName);

    return this.minioClient.putObject(bucketName, name, file);
  }

  async removeFile(bucket: string, name: string) {
    return this.minioClient.removeObject(bucket, name);
  }

  async createBucket(bucketName: string) {
    const exists = await this.minioClient.bucketExists(bucketName);

    if (!exists) {
      await this.minioClient.makeBucket(bucketName);
      await this.minioClient.setBucketPolicy(
        bucketName,
        JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucketName}/*`],
            },
          ],
        }),
      );
      this.logger.log(`Minio bucket ${bucketName} created.`);
    }
  }

  async getFile(bucket: string, name: string) {
    let dataChunks = [];
    const dataStream = await this.minioClient.getObject(bucket, name);

    return new Promise((resolve, reject) => {
      dataStream.on('error', (error) => {
        reject(error);
      });
      dataStream.on('data', function (chunk) {
        dataChunks.push(chunk);
      });
      dataStream.on('end', function () {
        const buffer = Buffer.concat(dataChunks);
        resolve(buffer);
      });
    });
  }
}
