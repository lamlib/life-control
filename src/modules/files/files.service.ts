import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import * as fs from 'fs';
import { error } from 'console';

@Injectable()
export class FilesService {
    constructor(private readonly configService: ConfigService) {}

    handleUploadFile(file: Express.Multer.File) {
        if(!file) {
            throw new BadRequestException('No file uploaded!')
        }

        const baseUrl = this.configService.get<string>('baseUrl');
        const fileUrl = `${baseUrl}/api/v1/files/image/${file.filename}`;

        return {
            success: 1,
            file: {
                url: fileUrl,
                name: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
            },
        };
    }

    async downloadPicFromUrl(picUrl: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const protocol = picUrl.startsWith('https') ? https : http;
                const uploadDest = this.configService.get<string>('files.pic.dest') || './upload';

                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const ext = path.extname(new URL(picUrl).pathname);
                const filename = `pic-${uniqueSuffix}${ext}`;
                const filepath = path.join(uploadDest, filename);

                if(fs.existsSync(uploadDest)) {
                    fs.mkdirSync(uploadDest, { recursive: true });
                }

                const file = fs.createWriteStream(filepath);

                protocol.get(picUrl, (response) => {
                    if(response.statusCode !== 200) {
                        reject(new Error(`Failed to download image: ${response.statusCode}`));
                        return;
                    }

                    const contentType = response.headers['content-type'];
                    if(!contentType || !contentType.startsWith('image/')) {
                        reject(new Error('URL does not point to an image'));
                        return;
                    }

                    response.pipe(file);

                    file.on('finish', () => {
                        file.close();
                        const baseUrl = this.configService.get<string>('baseUrl');
                        const fileUrl = `${baseUrl}/api/v1/files/image/${filename}`;

                        resolve({
                            success: 1,
                            file: {
                                url: fileUrl,
                                name: filename,
                                size: fs.statSync(filepath).size,
                                mimetype: contentType,
                            },
                        });
                    });

                    file.on('error', (err) => {
                        fs.unlink(filepath, () => {});
                        reject(err);
                    }) 
                }).on('error', (err) => {
                    reject(err);
                })
            } catch (error) {
                reject(error);
            }
        });
    }

    getImagePath(filename: string): string {
        const uploadDir = this.configService.get<string>('files.pic.dest') || './upload';
        return path.join(uploadDir, filename);
    }

    fileExists(filename: string): boolean {
        const filePath = this.getImagePath(filename);
        return fs.existsSync(filePath);
    }
}
