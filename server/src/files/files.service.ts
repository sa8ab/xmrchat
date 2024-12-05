import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileType } from 'src/shared/constants/enum';
import { File as FileEntity } from './file.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity) private repo: Repository<FileEntity>,
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
}
