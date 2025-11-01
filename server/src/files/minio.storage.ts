import { BadRequestException, Injectable } from '@nestjs/common';
import { MinioService } from './minio.service';
import { Request } from 'express';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { FILE_CONFIGS } from 'src/shared/constants/files';
import { FileType, MinioBucket } from 'src/shared/constants';
import { CreateFileDto } from './dtos/create-file.dto';
import sharp from 'sharp';
import { FilesService } from './files.service';

@Injectable()
export class MinioStorage {
  constructor(
    private minioService: MinioService,
    private filesService: FilesService,
  ) {}

  async _handleFile(
    req: Request,
    file: Express.Multer.File,
    cb: (err?: any, data?: any) => void,
  ) {
    try {
      const uuid = randomUUID();
      // console.log('_handleFile', uuid);
      const extention = extname(file.originalname);
      const fileType = req.params.type;

      const name = `${uuid}${extention}`;
      const config = FILE_CONFIGS[fileType as FileType];
      const bucket = config.bucket;
      const generateThumbnail = config.generateThumbnail;

      const stream = file.stream;
      let buffer: Buffer;
      try {
        buffer = await this.streamToBuffer(stream);
      } catch (error) {
        console.log('buffer error', error);
      }

      await this.minioService.uploadFile(buffer, bucket, name);

      if (generateThumbnail) {
        // console.log('generating thumbnail, name:', name);

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
        url: this.filesService.getFileUrl({ name, bucket }),
        thumbnail: generateThumbnail
          ? this.filesService.getFileUrl({
              name,
              bucket: MinioBucket.THUMBNAILS,
              isThumbnail: true,
            })
          : undefined,
      };

      cb(null, info);
    } catch (error) {
      console.log('error', error);
    }
  }

  async _removeFile(req: Request, file: any, cb: (err?: any) => void) {
    const config = FILE_CONFIGS[file.type as FileType];
    const bucket = config.bucket;

    // console.log('_removeFile', file.filename, bucket, file.type);
    await this.minioService.removeFile(bucket, file.filename);
    if (config.generateThumbnail) {
      await this.minioService.removeFile(
        MinioBucket.THUMBNAILS,
        `thumbnail-${file.filename}`,
      );
    }

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
