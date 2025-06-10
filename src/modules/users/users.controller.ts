import { Controller, Patch, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(
        private readonly _usersService: UsersService,
    ) {}

    @ApiOperation({ summary: 'Gửi email xác nhận' })
    @Post('email-confirm')
    async sendEmailConfirm(@Req() request) {
        this._usersService.sendEmailConfirm(request);
        const message = 'Gửi email xác nhận thành công!';
        return { message };
    }

    @Patch('email-confirm')
    async verifyEmailConfirm() {
        
    }
}
