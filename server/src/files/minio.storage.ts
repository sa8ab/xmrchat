import { BadRequestException, Injectable } from '@nestjs/common';
import { MinioService } from './minio.service';
import { Request } from 'express';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { FILE_CONFIGS } from 'src/shared/constants/files';
import { FileType, MinioBucket } from 'src/shared/constants';
import { CreateFileDto } from './dtos/create-file.dto';
import sharp from 'sharp';

@Injectable()
export class MinioStorage {
  constructor(private minioService: MinioService) {}

  async _handleFile(
    req: Request,
    file: Express.Multer.File,
    cb: (err?: any, data?: any) => void,
  ) {
    console.log('_handleFile', file.originalname);

    const uuid = randomUUID();
    const extention = extname(file.originalname);
    const fileType = req.params.type;

    const name = `${uuid}${extention}`;
    const config = FILE_CONFIGS[fileType as FileType];
    const bucket = config.bucket;
    const generateThumbnail = config.generateThumbnail;

    const stream = file.stream;
    const buffer = await this.streamToBuffer(stream);

    await this.minioService.uploadFile(buffer, bucket, name);

    if (generateThumbnail) {
      console.log('generating thumbnail');

      const thumbnailBuffer = await sharp(buffer)
        .resize(120, 120, { fit: 'cover' })
        .toBuffer();

      await this.minioService.uploadFile(
        thumbnailBuffer,
        MinioBucket.THUMBNAILS,
        `thumbnail-${name}`,
      );
    }

    const info: CreateFileDto = {
      filename: name,
      originalName: file.originalname,
      type: fileType as FileType,
    };

    cb(null, info);
  }

  async _removeFile(req: Request, file: any, cb: (err?: any) => void) {
    console.log('_removeFile', file.filename);

    const config = FILE_CONFIGS[file.type as FileType];
    const bucket = config.bucket;

    await this.minioService.removeFile(bucket, file.filename);

    cb(null);
  }

  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks as any)));
      stream.on('error', (err) => reject(err));
    });
  }
}
