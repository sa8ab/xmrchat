import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileType } from 'src/shared/constants/enum';
import { File as FileEntity } from './file.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Page } from 'src/pages/page.entity';
import { MinioService } from './minio.service';
import sharp from 'sharp';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity) private repo: Repository<FileEntity>,
    private minioService: MinioService,
    private configService: ConfigService,
  ) {}

  async createFile(payload: {
    filename: string;
    originalName: string;
    type: FileType;
    url?: string;
    thumbnail?: string;
  }) {
    const entity = this.repo.create(payload);

    return this.repo.save(entity);
  }

  getImageUrl(name: string, { isThumbnail } = { isThumbnail: false }) {
    return isThumbnail ? `/thumbnails/${name}` : `/images/${name}`;
  }

  async generateThumbnailsForCurrentLogos() {
    const query = this.repo
      .createQueryBuilder('file')
      .innerJoin(Page, 'page', 'page.logo_id = file.id');

    const files = await query.getMany();

    for (const f of files) {
      const buffer = await this.minioService.getFile('images', f.filename);
      const thumbnailBuffer = await sharp(buffer)
        .resize(120, 120, { fit: 'cover' })
        .toBuffer();

      const thumbnailFileName = `thumbnail-${f.filename}`;

      await this.minioService.uploadFile(
        thumbnailBuffer,
        'thumbnails',
        thumbnailFileName,
      );

      f.thumbnail = this.getImageUrl(f.filename, { isThumbnail: true });

      await this.repo.save(f);

      console.log('Saved file', f.filename);
    }
  }
}
