import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiAcceptedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Đăng ký mới tài khoản' })
    @Post('register')
    register(@Req() registerDto: Record<string, any>) {
        return this.authService.register(registerDto.userLoginEmailAddress, registerDto.userLoginPassword);
    }

    @ApiOperation({ summary: 'Đăng nhập bằng tài khoản đã đăng ký' })
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}