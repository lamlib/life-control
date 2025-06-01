import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from './userAccount.entity';
import { UserPermission } from './userPermission.entity';
import { UserLogin } from './userLogin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount, UserPermission, UserLogin])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
