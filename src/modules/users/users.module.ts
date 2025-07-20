import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Permission } from '../auth/entities/permission.entity';
import { InternalAccount } from './entities/internal-account.entity';
import { ConfigService } from '@nestjs/config';
import { EmailStatus } from './entities/email-status.entity';
import { Article } from '../articles/entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Permission,
      InternalAccount,
      EmailStatus,
    ]),
  ],
  providers: [UsersService, ConfigService],
  exports: [UsersService],
  controllers: [],
})
export class UsersModule {}
