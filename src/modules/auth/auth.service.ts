import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
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
import { RoleEnum } from '../../common/enums/role.enum';
import { InternalAccount } from '../users/entities/internal-account.entity';
import { EmailStatusEnum } from '../../common/enums/email-status.enum';
import { Role } from './entities/role.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Token)
        private readonly _tokenRepository: Repository<Token>,

        @InjectRepository(Role)
        private readonly _roleRepository: Repository<Role>,

        private readonly _usersService: UsersService,

        private readonly _configService: ConfigService,

        private readonly _jwtService: JwtService,

        private readonly _mailerService: MailerService,
    ) {}

    private async _createAccessToken(payload: Record<string, any>): Promise<{ accessToken: string, accessTokenExpire: Date }> {
        const accessToken = await this._jwtService.signAsync(payload, { expiresIn: this._configService.get<string>('jwt.accessTokenExpire.string') });
        const accessTokenExpire = new Date(Date.now() + parseInt(this._configService.get<string>('jwt.accessTokenExpire.number') as string));
        return {
            accessToken,
            accessTokenExpire,
        };
    }

    private async _createRefreshToken(payload: Record<string, any>): Promise<{ refreshToken: string, refreshTokenExpire: Date }> {
        const refreshToken = await this._jwtService.signAsync(payload, { expiresIn: this._configService.get<string>('jwt.refreshTokenExpire.string'), });
        const refreshTokenExpire = new Date(Date.now() + parseInt(this._configService.get<string>('jwt.refreshTokenExpire.number') as string));
        return {
            refreshToken,
            refreshTokenExpire,
        };
    }

    private async _createConfirmationToken(payload: Record<string, any>): Promise<{ confirmationToken: string, confirmationTokenExpire: Date }> {
        const confirmationToken = await this._jwtService.signAsync(payload, { expiresIn: this._configService.get<string>('jwt.confirmationTokenExpire.string') });
        const confirmationTokenExpire = new Date(Date.now() + parseInt(this._configService.get<string>('jwt.confirmationTokenExpire.number') as string));
        return {
            confirmationToken,
            confirmationTokenExpire,
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

    async parsePayload(token: string): Promise<any> {
        try {
            const secret = this._configService.get<string>('jwt.secret');
            const payload = await this._jwtService.verifyAsync(token, { secret });
            return payload;
        } catch (error) {
            throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn!');
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

    async sendEmailConfirm(request: Request): Promise<void> {
        const { accountId } = (request as any)['user'];
        const internalAccount = await this._usersService.findOneInternalAccountByAccountId(accountId);
        if(internalAccount.emailStatusId == EmailStatusEnum.VERIFIED) {
            throw new ConflictException('Địa chỉ email đã verify!');
        }
        if(internalAccount.emailStatusId == EmailStatusEnum.PENDING_VERIFICATION) {
            throw new ConflictException('Địa chỉ email đang xác thực!');
        }
        const { confirmationToken, confirmationTokenExpire } = await this._createConfirmationToken({ accountId });
        internalAccount.confirmationToken = confirmationToken;
        internalAccount.confirmationTokenExpire = confirmationTokenExpire;
        this._mailerService.sendMail({
            to: internalAccount.emailAddress,
            from: {
                name: 'LamLib Support Team',
                address: 'lamlib2023@gmail.com' // Sử dụng domain chính thức thay vì gmail
            },
            subject: 'Verify Your Account - Action Required',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Verification</title>
                <style>
                    body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    }
                    .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    .header {
                    text-align: center;
                    border-bottom: 2px solid #007bff;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                    }
                    .logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #007bff;
                    }
                    .content {
                    margin: 20px 0;
                    }
                    .verify-button {
                    display: inline-block;
                    background-color: #007bff;
                    color: white;
                    padding: 12px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    margin: 20px 0;
                    text-align: center;
                    }
                    .verify-button:hover {
                    background-color: #0056b3;
                    }
                    .footer {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                    }
                    .security-note {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-left: 4px solid #007bff;
                    margin: 20px 0;
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <div class="header">
                    <div class="logo">LamLib</div>
                    <h1>Account Verification Required</h1>
                    </div>
                    
                    <div class="content">
                    <p>Dear User,</p>
                    
                    <p>Thank you for creating an account with LamLib. To complete your registration and secure your account, please verify your email address by clicking the button below:</p>
                    
                    <div style="text-align: center;">
                        <a href="http://localhost:5173/pages/email-confirm?confirmationToken=${confirmationToken}" class="verify-button">Verify My Account</a>
                    </div>
                    
                    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">
                        http://localhost:5173/pages/email-confirm?confirmationToken=${confirmationToken}
                    </p>
                    
                    <div class="security-note">
                        <strong>Security Note:</strong> This verification link will expire in 24 hours for your security. If you didn't create this account, please ignore this email.
                    </div>
                    
                    <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                    
                    <p>Best regards,<br>
                    The LamLib Team</p>
                    </div>
                    
                    <div class="footer">
                    <p>This is an automated message. Please do not reply to this email.</p>
                    <p>© 2024 LamLib. All rights reserved.</p>
                    <p>If you no longer wish to receive these emails, you can <a href="#">unsubscribe here</a>.</p>
                    </div>
                </div>
                </body>
                </html>
            `,
            text: `
                Account Verification Required
                
                Dear User,
                
                Thank you for creating an account with LamLib. To complete your registration, please verify your email address by visiting this link:
                
                http://localhost:5173/pages/email-confirm?confirmationToken=${confirmationToken}
                
                This verification link will expire in 24 hours for your security.
                
                If you didn't create this account, please ignore this email.
                
                Best regards,
                The LamLib Team
                
                ---
                This is an automated message. Please do not reply to this email.
                © 2024 LamLib. All rights reserved.
            `
            })
        await this._usersService.saveInternalAccount(internalAccount);
    }

    async verifyEmailConfirm(confirmationToken: string): Promise<void> {
        const { accountId } = await this.parsePayload(confirmationToken);
        const internalAccount = await this._usersService.findOneInternalAccountByAccountId(accountId);
        if(internalAccount.emailStatusId == EmailStatusEnum.VERIFIED) {
            throw new ConflictException('Email đã được xác nhận trước đó!');
        }
        if(internalAccount.emailStatusId == EmailStatusEnum.UNVERIFIED) {
            throw new ConflictException('Email phải ở trạng thái đang chờ xác nhận trước khi xác nhận!');
        }
        if(
            internalAccount.confirmationToken !== confirmationToken || 
            !internalAccount.confirmationTokenExpire || 
            internalAccount.confirmationTokenExpire.getTime() < Date.now()) {
            throw new UnauthorizedException('Xác nhận email không hợp lệ!');
        }
        internalAccount.emailStatusId = EmailStatusEnum.VERIFIED;
        internalAccount.confirmationToken = null;
        internalAccount.confirmationTokenExpire = null;
        const account = await this._usersService.findOneAccountById(accountId);
        const role = await this._roleRepository.findOneByOrFail({id: RoleEnum.CLIENT});
        account.roleId = role.id;
    }
}
