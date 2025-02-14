import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export const FileUploadInterceptor = (fieldName = 'image') =>
  FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: './uploads',
      filename: async (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException(
              'Seuls les fichiers jpg et png sont acceptés',
            ),
            null,
          );
        }
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${file.originalname.slice(
          file.originalname.lastIndexOf('.'),
        )}`;

        callback(null, filename);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max
    },
  });
