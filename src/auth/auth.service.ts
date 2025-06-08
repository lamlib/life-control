import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './userRole.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenLogin } from './entities/tokenLogin.entity';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,

        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>,

        @InjectRepository(TokenLogin)
        private tokenLoginRepository: Repository<TokenLogin>,

        private jwtService: JwtService
    ) {}

    async register(registerDTO :RegisterDTO) {
        const userRole = await this.userRoleRepository.findOneBy({ userRoleDescription: 'Guest' });
        if (userRole) {
            await this.usersService.createUserLogin(registerDTO, userRole.userRoleId);
        } else {
            throw new Error('User role "Guest" not found');
        }
    }

    async login(loginDto: LoginDto) {
        const userLogin = await this.usersService.validateUserLoginPassword(loginDto.userLoginEmailAddress, loginDto.userLoginPassword);
        if (userLogin) {
            const userAccount = await this.usersService.findOneUserAccount(userLogin.userAccountId);
            
            const tokenLogin = new TokenLogin();

            const { userAccountId, userAccountFirstName } = userAccount;

            tokenLogin.tokenLoginRefresh = await this.jwtService.signAsync({ userAccountId, userAccountFirstName });
            tokenLogin.tokenLoginRefreshExpire = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày
            tokenLogin.userAccountId = userAccount.userAccountId;
        
            this.tokenLoginRepository.save(tokenLogin);
            return {
                data: {
                    userId: userAccountId,
                    username: userAccountFirstName,
                    email: userLogin.userLoginEmailAddress,
                    accessToken: await this.jwtService.signAsync({ userAccountId, userAccountFirstName }),
                    refreshToken: tokenLogin.tokenLoginRefresh,
                },
                status: HttpStatus.OK,
            };
        } else {
            throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng!');
        }
    }

    async profile(request: Request) {
        return {
            data: (request as any)['user'],
            message: 'Đọc thành công hồ sơ ngươi dùng',
            status: HttpStatus.OK,
        }
    }
}
