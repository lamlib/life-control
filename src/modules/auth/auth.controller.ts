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

    @ApiOperation({ summary: 'Đăng ký mới tài khoản' })
    @Public()
    @Post('register')
    async register(@Body() registerDTO: RegisterDTO) {
        const data = await this.authService.register(registerDTO);
        const message = 'Đăng ký tài khoản thành công!'
        return { data, message };
    }

    @ApiOperation({ summary: 'Đăng nhập bằng tài khoản đã đăng ký' })
    @Public()
    @Post('login')
    async login(@Body() loginDTO: LoginDto) {
        const data = await this.authService.login(loginDTO);
        const message = 'Đăng nhập thành công!'
        return { data, message };
    }

    @ApiOperation({ summary: 'Lấy lại access token bằng refresh token' })
    @Public()
    @Post('refresh')
    async refresh(@Body() refreshDTO: RefreshDTO) {
        const data = await this.authService.refresh(refreshDTO);
        const message = 'Đọc hồ sơ người dùng thành công!'
        return { data, message };
    }

    @ApiOperation({ summary: 'Đọc hồ sơ người dùng' })
    @Get('profile')
    async profile(@Req() request: Request) {
        const data = await this.authService.profile(request);
        const message = 'Đọc hồ sơ người dùng thành công!'
        return { data, message };
    }
}