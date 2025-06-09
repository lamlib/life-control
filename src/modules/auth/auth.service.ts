import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './entities/userRole.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenLogin } from './entities/tokenLogin.entity';
import { Request } from 'express';
import { RefreshDTO } from './dto/refresh.dto';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,

        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>,

        @InjectRepository(TokenLogin)
        private tokenLoginRepository: Repository<TokenLogin>,

        private configService: ConfigService,

        private jwtService: JwtService,

        private readonly mailerService: MailerService,
    ) {}

    async refresh(refreshDTO: RefreshDTO) {
        const tokenLogin = await this.tokenLoginRepository.findOneBy({ tokenLoginRefresh: refreshDTO.tokenLoginRefresh });
        if(tokenLogin) {
            if(tokenLogin.tokenLoginRefreshExpire.getTime() < Date.now()) {
                this.tokenLoginRepository.remove(tokenLogin);
                throw new UnauthorizedException('Refresh token không hợp lệ!');
            }
            tokenLogin.tokenLoginRefresh = await this.jwtService.signAsync({ userAccountId: tokenLogin.userAccountId }, {
                expiresIn: this.configService.get<string>('jwt.refreshTokenExpires.string'),
            });
            this.tokenLoginRepository.save(tokenLogin);
            return {
                data: {
                    accessToken: await this.jwtService.signAsync({ tokenLogin: tokenLogin.userAccountId }, {
                        expiresIn: this.configService.get<string>('jwt.accessTokenExpires.string'),
                    }),
                    refreshToken: tokenLogin.tokenLoginRefresh,
                    accessTokenExpire: new Date(Date.now() + parseInt(this.configService.get<string>('jwt.accessTokenExpires.number') as string))
                }
            }
        } else {
            throw new UnauthorizedException('Refresh token không hợp lệ!')
        }
    }

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

            tokenLogin.tokenLoginRefresh = await this.jwtService.signAsync({ userAccountId }, {
                expiresIn: this.configService.get<string>('jwt.refreshTokenExpires.string'),
            });
            tokenLogin.tokenLoginRefreshExpire = new Date(Date.now() + parseInt(this.configService.get<string>('jwt.refreshTokenExpires.number') as string));
            tokenLogin.userAccountId = userAccount.userAccountId;
        
            this.tokenLoginRepository.save(tokenLogin);
            return {
                data: {
                    userId: userAccountId,
                    username: userAccountFirstName,
                    email: userLogin.userLoginEmailAddress,
                    accessToken: await this.jwtService.signAsync({ userAccountId }, { expiresIn: this.configService.get<string>('jwt.accessTokenExpires.string') }),
                    refreshToken: tokenLogin.tokenLoginRefresh,
                    accessTokenExpire: new Date(Date.now() + parseInt(this.configService.get<string>('jwt.accessTokenExpires.number') as string))
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

    private async sendVerifyAccountMail(): Promise<void> {
        this.mailerService.sendMail({
            to: 'lamlib2023@gmail.com',
            from: 'lamlib2023@gmail.com',
            subject: 'Kiểm thử gửi mail',
            text: 'Xin chào',
            html: '<b>Xin chào</b>'
        })
    }
}
