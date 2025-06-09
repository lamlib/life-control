import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Request } from 'express';
import { RefreshDTO } from './dto/refresh.dto';

@ApiTags('Xác thực')
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

    @Public()
    @ApiOperation({ summary: 'Lấy lại access token bằng refresh token' })
    @Post('refresh')
    refresh(@Body() refreshDTO: RefreshDTO) {
        return this.authService.refresh(refreshDTO);
    }

    @ApiOperation({ summary: 'Đọc hồ sơ người dùng' })
    @Get('profile')
    profile(@Req() request: Request) {
        return this.authService.profile(request);
    }
}