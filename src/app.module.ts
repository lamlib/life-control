import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { UserAccount } from './users/userAccount.entity';
import { UserPermission } from './users/userPermission.entity';
import { UserRole } from './users/userRole.entity';
import { UserRolePermission } from './users/userRolePermission.entity';
import { UserLogin } from './users/userLogin.entity';
import { HashingAlgorithm } from './users/hashingAlgorithm.entity';
import { EmailValidationStatus } from './users/emailValidationStatus.entity';
import { UserLoginExternal } from './users/userLoginExternal.entity';
import { ExternalProvider } from './users/externalProvider.entity';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'Lamlibok@123',
      database: 'clover',
      entities: [UserAccount, UserPermission, UserRole, UserRolePermission, UserLogin, HashingAlgorithm, EmailValidationStatus, UserLoginExternal, ExternalProvider],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
