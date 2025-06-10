import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Token } from './entities/refresh-token.entity';
import { Request } from 'express';
import { RefreshDTO } from './dto/refresh.dto';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { RoleEnum } from 'src/common/enums/role.enum';
import { InternalAccount } from '../users/entities/internal-account.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Token)
        private readonly _tokenRepository: Repository<Token>,

        private readonly _usersService: UsersService,

        private readonly _configService: ConfigService,

        private readonly _jwtService: JwtService,

        private readonly _mailerService: MailerService,
    ) {}

    private async _createAccessToken(payload: Record<string, any>): Promise<{ accessToken: string, accessTokenExpire: Date }> {
        const accessToken = await this._jwtService.signAsync(payload, { expiresIn: this._configService.get<string>('jwt.accessTokenExpires.string') });
        const accessTokenExpire = new Date(Date.now() + parseInt(this._configService.get<string>('jwt.accessTokenExpires.number') as string));
        return {
            accessToken,
            accessTokenExpire,
        };
    }

    private async _createRefreshToken(payload: Record<string, any>): Promise<{ refreshToken: string, refreshTokenExpire: Date }> {
        const refreshToken = await this._jwtService.signAsync(payload, { expiresIn: this._configService.get<string>('jwt.refreshTokenExpires.string') });
        const refreshTokenExpire = new Date(Date.now() + parseInt(this._configService.get<string>('jwt.refreshTokenExpires.number') as string));
        return {
            refreshToken,
            refreshTokenExpire,
        };
    }

    private async _createToken(internalAccount: InternalAccount): Promise<{accessToken: string; refreshToken: string; accessTokenExpire: Date}>  {
        const { accountId } = internalAccount;
        const { refreshToken, refreshTokenExpire } = await this._createRefreshToken({ accountId });
        const { accessToken, accessTokenExpire } = await this._createAccessToken({ accountId });
        
        const token = new Token();
        token.accountId = accountId;
        token.refreshToken = refreshToken;
        token.refreshTokenExpire = refreshTokenExpire;

        this._tokenRepository.save(token);

        return {
            accessToken,
            refreshToken,
            accessTokenExpire,
        };
    }

    private _deleteToken(token: Token) {
        if(token.refreshTokenExpire.getTime() < Date.now()) {
            this._tokenRepository.remove(token);
            return true;
        }
        return false;
    }

    async extractTokenFromHeader(request: Request): Promise<string> {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        if (type !== 'Bearer') {
            throw new UnauthorizedException();
        }
        return token;
    }

    async parsePayload(accessToken: string): Promise<any> {
        try {
            const secret = this._configService.get<string>('jwt.secret');
            const payload = await this._jwtService.verifyAsync(accessToken, { secret });
            return payload;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    async register(registerDTO: RegisterDTO): Promise<{accessToken: string; refreshToken: string; accessTokenExpire: Date}> {
        const internalAccount = await this._usersService.createInternalAccount(registerDTO, RoleEnum.GUEST);
        return await this._createToken(internalAccount);
    }

    async login(loginDTO: LoginDto): Promise<{accessToken: string; refreshToken: string; accessTokenExpire: Date}> {
        const internalAccount = await this._usersService.checkInternalAccount(loginDTO);
        return await this._createToken(internalAccount);
    }

    async refresh(refreshDTO: RefreshDTO): Promise<{accessToken: string; refreshToken: string; accessTokenExpire: Date}> {
        const { refreshToken: r } = refreshDTO;

        const token = await this._tokenRepository.findOneBy({ refreshToken: r });

        if(!token) {
            throw new UnauthorizedException('Refresh token không hợp lệ!');
        }

        if(this._deleteToken(token)) {
            throw new UnauthorizedException('Refresh token không hợp lệ!');
        }

        const { accountId } = token;
        const { refreshToken } = await this._createRefreshToken({ accountId });
        const { accessToken, accessTokenExpire } = await this._createAccessToken({ accountId });

        token.refreshToken = refreshToken;
        this._tokenRepository.save(token);

        return {
            accessToken,
            refreshToken,
            accessTokenExpire,
        }
    }

    async profile(request: Request) {
        return {
            user: (request as any)['user'],
        }
    }
}
