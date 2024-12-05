import { Expose } from 'class-transformer';

export class FileDto {
  @Expose()
  id: number;

  @Expose()
  filename: string;

  @Expose()
  originalName: string;

  @Expose()
  url: string;

  @Expose()
  thumbnail: string;

  @Expose()
  createdAt: Date;
}
