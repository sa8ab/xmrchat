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
  }) {
    const entity = await this.repo.create(payload);

    return this.repo.save(entity);
  }

  getImageUrl(name) {
    // const base = `${this.configService.get('MINIO_URL')}:${this.configService.get('MINIO_PORT')}`;
    return `/images/${name}`;
  }
}
