import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
    ) {}

    async register(userLoginEmailAddress: string, userLoginPassword: string) {
        await this.usersService.createUserLogin(userLoginEmailAddress, userLoginPassword);
    }
}
