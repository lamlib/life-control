import { Body, Controller, Get, HttpRedirectResponse, Param, Patch, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Request } from 'express';
import { RefreshDTO } from './dto/refresh.dto';

@ApiTags('Xác thực')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiOperation({ summary: 'Đăng ký mới tài khoản' })
  @Public()
  @Post('register')
  async register(@Body() registerDTO: RegisterDTO) {
    await this.authService.register(registerDTO);
    const message = 'Vui lòng xác thực địa chỉ email!';
    return { message };
  }

  @ApiOperation({ summary: 'Đăng nhập bằng tài khoản đã đăng ký' })
  @Public()
  @Post('login')
  async login(@Body() loginDTO: LoginDto) {
    const data = await this.authService.login(loginDTO);
    const message = 'Đăng nhập thành công!';
    return { ...data, message };
  }

  @ApiOperation({ summary: 'Lấy lại access token bằng refresh token' })
  @Public()
  @Post('refresh')
  async refresh(@Body() refreshDTO: RefreshDTO) {
    const data = await this.authService.refresh(refreshDTO);
    const message = 'Đọc hồ sơ người dùng thành công!';
    return { ...data, message };
  }

  @ApiOperation({ summary: 'Đọc hồ sơ người dùng' })
  @Get('profile')
  async profile(@Req() request: Request) {
    const data = await this.authService.profile(request);
    if(data) {
      return { ...data, message: 'Đọc hồ sơ người dùng thành công!' };
    }
    return { message: 'Chưa đăng nhập!' };
  }

  @Patch('email-confirm')
  async verifyEmailConfirm(
    @Param('confirmationToken') confirmationToken: string,
  ) {
    this.authService.verifyEmailConfirm(confirmationToken);
    const message = 'Xác nhận email thành công!';
    return { message };
  }
}
