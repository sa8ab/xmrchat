import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File as FileEntity } from './file.entity';
import { MinioService } from './minio.service';
import { MinioStorage } from './minio.storage';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FilesController],
  providers: [FilesService, MinioService, MinioStorage],
  exports: [FilesService, MinioStorage],
})
export class FilesModule {}
