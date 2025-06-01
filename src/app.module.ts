import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'; 
import { UserAccount } from './users/userAccount.entity';
import { UserPermission } from './users/userPermission.entity';
import { UserRole } from './users/userRole.entity';
import { UserRolePermission } from './users/userRolePermission.entity';
import { UserLogin } from './users/userLogin.entity';
import { HashingAlgorithm } from './users/hashingAlgorithm.entity';
import { EmailValidationStatus } from './users/emailValidationStatus.entity';
import { UserLoginExternal } from './users/userLoginExternal.entity';
import { ExternalProvider } from './users/externalProvider.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [ `.env.${process.env.NODE_ENV}`, `.env.example` ]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: Number(configService.get<string>('DATABASE_PORT')),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
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
