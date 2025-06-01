import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from './constants';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() registerDto: Record<string, any>) {
        return this.authService.register(registerDto.userLoginEmailAddress, registerDto.userLoginPassword);
    }

    @Public()
    @Get()
    findAll() {
        return []
    }
}
