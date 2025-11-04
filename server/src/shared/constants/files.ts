import { FileType, MinioBucket } from './enum';

export const FILE_CONFIGS = {
  [FileType.PAGE_LOGO]: {
    types: ['jpg', 'jpeg', 'png'],
    maxSize: 8 * 1024 * 1024,
    maxCount: 1,
    bucket: MinioBucket.IMAGES,
    generateThumbnail: true,
  },
  [FileType.PAGE_BANNER]: {
    types: ['jpg', 'jpeg', 'png'],
    maxSize: 8 * 1024 * 1024,
    maxCount: 1,
    bucket: MinioBucket.IMAGES,
    generateThumbnail: true,
  },
  [FileType.OBS_SOUND]: {
    types: ['mp3', 'mpeg', 'wav', 'ogg'],
    maxSize: 10 * 1024 * 1024,
    maxCount: 1,
    bucket: MinioBucket.MEDIA,
    generateThumbnail: false,
  },
};

export const MINIO_BUCKETS = {
  [MinioBucket.MEDIA]: {
    name: MinioBucket.MEDIA,
    public: true,
  },
  [MinioBucket.IMAGES]: {
    name: MinioBucket.IMAGES,
    public: true,
  },
  [MinioBucket.THUMBNAILS]: {
    name: MinioBucket.THUMBNAILS,
    public: true,
  },
};
