import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermission } from 'src/users/userPermission.entity';
import { UserRole } from 'src/users/userRole.entity';
import { UserRolePermission } from 'src/users/userRolePermission.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([UserPermission, UserRole, UserRolePermission])
  ],
  providers: [ AuthService ],
  controllers: [AuthController],
  exports: [ AuthService ]
})
export class AuthModule {}
