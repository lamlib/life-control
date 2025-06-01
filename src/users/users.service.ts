import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLogin } from './userLogin.entity';
import { Repository } from 'typeorm';
import { UserAccount } from './userAccount.entity';
import * as bcrypt from 'bcrypt';


// Đây nên là một class/interface chuẩn để đại diện cho một user entity
export type User = {
    userId: number;
    username: string;
    password: string;
};

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserLogin)
        private userLoginRepository: Repository<UserLogin>,
        @InjectRepository(UserAccount)
        private userAccountRepository: Repository<UserAccount>,
    ) {}
    private readonly users = [
        {
            userId: 1,
            username: 'john',
            password: 'changeme',
        },
        {
            userId: 2,
            username: '',
            password: '',
        },
    ];

    /**
     * Lấy ra tất cả các tài khoản người dùng
     */
    async findAllUserAccount(): Promise<UserAccount[]> {
        return this.userAccountRepository.find();
    }

    /**
     * Lấy ra một tài khoản của người dùng
     */
    async findOneUserAccount(userAccountId: number): Promise<UserAccount> {
        const userAccount = await this.userAccountRepository.findOneBy({userAccountId: userAccountId});
        if(userAccount === null) {
            throw new Error("User is not exits");
        }
        return userAccount;
    }

    /**
     * Lấy ra một tài khoản đã login bằng tài khoản mật khẩu, nếu không có trả về null
     */
    async findOneUserLoginByEmailAdress(userLoginEmailAddress: string): Promise<UserLogin | null> {
        const userLogin = await this.userLoginRepository.findOneBy({ userLoginEmailAddress });
        return userLogin;
    }

    /**
     * Tạo mới người dùng đăng nhập qua tài khoản mật khẩu, nếu đã tồn tại thì lỗi
     */
    async createUserLogin(userLoginEmailAddress: string, userLoginPassword: string): Promise<UserLogin> {
        const userLoginExisted = await this.findOneUserLoginByEmailAdress(userLoginEmailAddress);

        if (userLoginExisted) throw new Error(`User with email ${userLoginEmailAddress} is existed, please using other email!` )
        
        let newUserAccount = new UserAccount();
        newUserAccount = await this.userAccountRepository.create(newUserAccount);
        console.log(newUserAccount);

        let newUserLogin = new UserLogin();

        newUserLogin.userAccountId = newUserAccount.userAccountId;
        newUserLogin.userLoginPasswordSalt = await bcrypt.genSalt();
        newUserLogin.userLoginPasswordHash = await bcrypt.hash(userLoginPassword, newUserLogin.userLoginPasswordSalt);
        newUserLogin.userLoginEmailAddress = userLoginEmailAddress;

        newUserLogin = await this.userLoginRepository.create(newUserLogin);
        console.log(newUserLogin);
        return newUserLogin;
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
}
