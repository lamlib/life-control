import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiAcceptedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @ApiOperation({ summary: 'Đăng ký mới tài khoản' })
    @Post('register')
    register(@Body() registerDTO: RegisterDTO) {
        return this.authService.register(registerDTO);
    }

    @Public()
    @ApiOperation({ summary: 'Đăng nhập bằng tài khoản đã đăng ký' })
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @ApiOperation({ summary: 'Đọc hồ sơ người dùng' })
    @Get('profile')
    profile(@Req() request: Request) {
        return this.authService.profile(request);
    }
}