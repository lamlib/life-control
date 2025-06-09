import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Permission } from '../auth/entities/permission.entity';
import { InternalAccount } from './entities/internal-account.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Permission, InternalAccount])],
  providers: [UsersService, ConfigService],
  exports: [UsersService],
})
export class UsersModule {}
