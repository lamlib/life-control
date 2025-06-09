import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'; 
import { UserAccount } from './modules/users/entities/userAccount.entity';
import { UserPermission } from './modules/auth/entities/userPermission.entity';
import { UserRole } from './modules/auth/entities/userRole.entity';
import { UserRolePermission } from './modules/auth/entities/userRolePermission.entity';
import { UserLogin } from './modules/users/entities/userLogin.entity';
import { HashingAlgorithm } from './modules/auth/entities/hashingAlgorithm.entity';
import { EmailValidationStatus } from './modules/users/entities/emailValidationStatus.entity';
import { UserLoginExternal } from './modules/users/entities/userLoginExternal.entity';
import { ExternalProvider } from './modules/users/entities/externalProvider.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TokenLogin } from './modules/auth/entities/tokenLogin.entity';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';

@Module({
  imports: [
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      envFilePath: [ `.env.${process.env.NODE_ENV}`, `.env.development` ],
      load: [configuration],
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MailerOptions => ({
        transport: {
          host: configService.get<string>('email.host'),
          port: parseInt(configService.get<string>('email.port') as string),
          auth: {
            user: configService.get<string>('email.username'),
            pass: configService.get<string>('email.password'),
          }
        }
      })
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: configService.get<string>('database.type') as any,
        host: configService.get<string>('database.host'),
        port: Number(configService.get<string>('database.port')),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [UserAccount, UserPermission, UserRole, UserRolePermission, UserLogin, HashingAlgorithm, EmailValidationStatus, UserLoginExternal, ExternalProvider, TokenLogin],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    MailerModule,
  ],
})
export class AppModule {}
