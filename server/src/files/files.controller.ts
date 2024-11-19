import {
  Controller,
  Post,
  UploadedFile,
  Param,
  ParseEnumPipe,
  BadRequestException,
} from '@nestjs/common';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { ImageUploadInterceptor } from 'src/shared/interceptors/image-upload.interceptor';
import { FilesService } from './files.service';
import { FileType } from 'src/shared/constants/enum';
import { MinioService } from './minio.service';
import { Express } from 'express';

@Controller('upload')
export class FilesController {
  constructor(
    private filesService: FilesService,
    private minioService: MinioService,
  ) {}

  @IsPublic()
  @ImageUploadInterceptor()
  @Post('/image/:slug')
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('slug', new ParseEnumPipe(FileType)) slug: FileType,
  ) {
    if (!file) throw new BadRequestException('No file is uploaded.');

    await this.minioService.uploadFile(file, 'images', file.filename);

    const savedFile = await this.filesService.createFile({
      filename: file.filename,
      type: slug,
      originalName: file.originalname,
      url: this.filesService.getImageUrl(file.filename),
    });

    // TODO: add thumbnail

    return {
      file: savedFile,
    };
  }
}
