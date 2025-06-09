import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Token } from './entities/refresh-token.entity';
import { Request } from 'express';
import { RefreshDTO } from './dto/refresh.dto';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { RoleEnum } from 'src/common/enums/role.enum';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,

        @InjectRepository(Role)
        private userRoleRepository: Repository<Role>,

        @InjectRepository(Token)
        private tokenLoginRepository: Repository<Token>,

        private configService: ConfigService,

        private jwtService: JwtService,

        private readonly mailerService: MailerService,
    ) {}

    async refresh(refreshDTO: RefreshDTO) {
        const tokenLogin = await this.tokenLoginRepository.findOneBy({ refreshToken: refreshDTO.refreshToken });
        if(tokenLogin) {
            if(tokenLogin.refreshTokenExpire.getTime() < Date.now()) {
                this.tokenLoginRepository.remove(tokenLogin);
                throw new UnauthorizedException('Refresh token không hợp lệ!');
            }
            tokenLogin.refreshToken = await this.jwtService.signAsync({ accountId: tokenLogin.accountId }, {
                expiresIn: this.configService.get<string>('jwt.refreshTokenExpires.string'),
            });
            this.tokenLoginRepository.save(tokenLogin);
            return {
                data: {
                    accessToken: await this.jwtService.signAsync({ tokenLogin: tokenLogin.accountId }, {
                        expiresIn: this.configService.get<string>('jwt.accessTokenExpires.string'),
                    }),
                    refreshToken: tokenLogin.refreshToken,
                    accessTokenExpire: new Date(Date.now() + parseInt(this.configService.get<string>('jwt.accessTokenExpires.number') as string))
                }
            }
        } else {
            throw new UnauthorizedException('Refresh token không hợp lệ!')
        }
    }

    async register(registerDTO :RegisterDTO) {
        await this.usersService.createUserLogin(registerDTO, RoleEnum.GUEST);
    }

    async login(loginDto: LoginDto) {
        const userLogin = await this.usersService.validateUserLoginPassword(loginDto.emailAdress, loginDto.userLoginPassword);
        if (userLogin) {
            const userAccount = await this.usersService.findOneUserAccount(userLogin.accountId);
            
            const tokenLogin = new Token();

            const { accountId, firstName } = userAccount;

            tokenLogin.refreshToken = await this.jwtService.signAsync({ accountId }, {
                expiresIn: this.configService.get<string>('jwt.refreshTokenExpires.string'),
            });
            tokenLogin.refreshTokenExpire = new Date(Date.now() + parseInt(this.configService.get<string>('jwt.refreshTokenExpires.number') as string));
            tokenLogin.accountId = userAccount.accountId;
        
            this.tokenLoginRepository.save(tokenLogin);
            return {
                data: {
                    userId: accountId,
                    username: firstName,
                    email: userLogin.emailAdress,
                    accessToken: await this.jwtService.signAsync({ accountId }, { expiresIn: this.configService.get<string>('jwt.accessTokenExpires.string') }),
                    refreshToken: tokenLogin.refreshToken,
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
