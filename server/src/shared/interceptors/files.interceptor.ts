import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MinioService } from 'src/files/minio.service';
import { FilesInterceptor as NestFilesInterceptor } from '@nestjs/platform-express';
import { FILE_CONFIGS } from '../constants/files';
import { extname } from 'path';
import { MinioStorage } from 'src/files/minio.storage';

@Injectable()
export class FilesInterceptor implements NestInterceptor {
  constructor(private minioStorage: MinioStorage) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const fileType = request.params?.type;
    if (!fileType) throw new BadRequestException('File type is required');

    const config = FILE_CONFIGS[fileType];
    if (!config) throw new BadRequestException('Invalid file type parameter');

    const InterceptorMixin = NestFilesInterceptor('files', config.maxCount, {
      storage: this.minioStorage,
      limits: {
        fileSize: config.maxSize,
      },

      fileFilter: (req, file, cb) => {
        const matches = file.mimetype.match(
          new RegExp(`\\/(${config.types.join('|')})$`),
        );
        if (!matches)
          return cb(new BadRequestException('Invalid file type'), false);

        cb(null, true);
      },
    });

    const interceptor = new InterceptorMixin();

    return await interceptor.intercept(context, next);
  }
}
