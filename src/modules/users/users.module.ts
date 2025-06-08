import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from './entities/userAccount.entity';
import { UserPermission } from '../auth/entities/userPermission.entity';
import { UserLogin } from './entities/userLogin.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount, UserPermission, UserLogin])],
  providers: [UsersService, ConfigService],
  exports: [UsersService],
})
export class UsersModule {}
