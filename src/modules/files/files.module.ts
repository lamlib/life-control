import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  controllers: [FilesController],
  providers: [FilesService, ConfigService],
  imports: [
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<MulterOptions> => {
        return {
          storage: diskStorage({
            destination: configService.get<string>('files.pic.dest'),
            filename(req, file, callback) {
              const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
              const ext = extname(file.originalname);
              const filename = `pic-${uniqueSuffix}${ext}`;
              callback(null, filename);
            },
          }),
          fileFilter(req, file, callback) {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
              callback(null, true);
            } else {
              callback(new Error('Only picture files are allowed!'), false);
            }
          },
          limits: {
            fileSize: 5 * 1024 * 1024,
          },
        };
      },
    }),
  ],
})
export class FilesModule {}
