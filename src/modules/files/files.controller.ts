import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { SkipTransform } from '../../common/decorators/skip-transform.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';

@Controller('api/v1/files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post('byFile')
    @SkipTransform()
    @Public()
    @UseInterceptors(FileInterceptor('image'))
    async uploadByFile(@UploadedFile() file: Express.Multer.File) {
        try {
            return this.filesService.handleUploadFile(file)
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post('byUrl')
    @Public()
    @SkipTransform()
    async uploadByUrl(@Body() body: { url: string }) {
        try {
            if(!body.url) {
                throw new BadRequestException('URL is required');
            }

            try {
                new URL(body.url);
            } catch (error) {
                throw new BadRequestException('Invalid URL format');
            }

            return await this.filesService.downloadPicFromUrl(body.url);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get('image/:filename')
    @Public()
    async serveImage(@Param('filename') filename: string, @Res() res: Response) {
        try {
            if(!this.filesService.fileExists(filename)) {
                throw new NotFoundException('Image not found');
            }

            const filepath = this.filesService.getImagePath(filename);
            return res.sendFile(filepath)
        } catch (error) {
            throw new NotFoundException('Image not found');
        }
    }
}
