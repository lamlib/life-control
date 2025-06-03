import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'; 
import { UserAccount } from './users/userAccount.entity';
import { UserPermission } from './auth/userPermission.entity';
import { UserRole } from './auth/userRole.entity';
import { UserRolePermission } from './auth/userRolePermission.entity';
import { UserLogin } from './users/userLogin.entity';
import { HashingAlgorithm } from './auth/hashingAlgorithm.entity';
import { EmailValidationStatus } from './users/emailValidationStatus.entity';
import { UserLoginExternal } from './users/userLoginExternal.entity';
import { ExternalProvider } from './users/externalProvider.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      envFilePath: [ `.env.${process.env.NODE_ENV}`, `.env.example` ],
      load: [configuration],
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
        entities: [UserAccount, UserPermission, UserRole, UserRolePermission, UserLogin, HashingAlgorithm, EmailValidationStatus, UserLoginExternal, ExternalProvider],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
