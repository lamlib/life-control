import { Body, Controller, Post, Req, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Register new user' })
    @Post('register')
    register(@Req() registerDto: Record<string, any>) {
        return this.authService.register(registerDto.userLoginEmailAddress, registerDto.userLoginPassword);
    }

    @ApiOperation({ summary: 'Login user' })
    @Post('login')
    @UseInterceptors(NoFilesInterceptor())
    login(@Body() loginDto) {
        console.log(loginDto);
        return this.authService.login(loginDto.userLoginEmailAddress, loginDto.userLoginPassword);
    }
}