import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPermission } from './userPermission.entity';
import { UserRole } from './userRole.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(UserPermission)
        private userPermissionRepository: Repository<UserPermission>,
        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>,
    ) {}

    async register(userLoginEmailAddress: string, userLoginPassword: string) {
        const userRole = await this.userRoleRepository.findOneBy({ userRoleDescription: 'Guest' });
        if (userRole) {
            await this.usersService.createUserLogin(userLoginEmailAddress, userLoginPassword, userRole.userRoleId);
        } else {
            throw new Error('User role "Guest" not found');
        }
    }

    async login(userLoginEmailAddress: string, userLoginPassword: string) {
        const userLogin = await this.usersService.validateUserLoginPassword(userLoginEmailAddress, userLoginPassword);
        if (userLogin) {
            const userAccount = await this.usersService.findOneUserAccount(userLogin.userAccountId);
            return {
                userId: userAccount.userAccountId,
                username: userAccount.userAccountFirstName,
                email: userLogin.userLoginEmailAddress,
            };
        }
    }
}
