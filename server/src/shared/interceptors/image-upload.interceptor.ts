import { BadRequestException, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';

export const ImageUploadInterceptor = () => {
  return UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uuid = randomUUID();
          const extention = extname(file.originalname);

          const name = `${uuid}${extention}`;

          cb(null, name);
        },
      }),
      fileFilter: (req, file, cb) => {
        const matches = file.mimetype.match(/\/(jpg|jpeg|png)$/);

        if (!matches)
          cb(
            new BadRequestException('Only jpg, jpeg and png are accepted.'),
            false,
          );

        cb(null, true);
      },

      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  );
};
