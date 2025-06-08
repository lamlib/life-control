import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLogin } from './entities/userLogin.entity';
import { Repository } from 'typeorm';
import { UserAccount } from './entities/userAccount.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from 'src/modules/auth/dto/register.dto';

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

    async validateUserLoginPassword(userLoginEmailAddress: string, userLoginPassword: string): Promise<UserLogin | null> {
        const userLogin = await this.findOneUserLoginByEmailAdress(userLoginEmailAddress);  
        if (!userLogin) {
            return null; // Không tìm thấy người dùng
        }
        const isPasswordValid = await bcrypt.compare(userLoginPassword, userLogin.userLoginPasswordHash);
        if (!isPasswordValid) {
            return null; // Mật khẩu không hợp lệ
        }
        return userLogin; // Mật khẩu hợp lệ
    }

    /**
     * Tạo mới người dùng đăng nhập qua tài khoản mật khẩu, nếu đã tồn tại thì lỗi
     */
    async createUserLogin(registerDTO: RegisterDTO, userRoleId: number): Promise<UserLogin> {
        const userLoginExisted = await this.findOneUserLoginByEmailAdress(registerDTO.userLoginEmailAddress);

        if (userLoginExisted) throw new Error(`User with email ${registerDTO.userLoginEmailAddress} is existed, please using other email!` )
        
        let newUserAccount = new UserAccount();
        newUserAccount.userRoleId = userRoleId;
        newUserAccount = await this.userAccountRepository.save(newUserAccount);

        let newUserLogin = new UserLogin();

        newUserLogin.userAccountId = newUserAccount.userAccountId;
        newUserLogin.userLoginPasswordSalt = await bcrypt.genSalt();
        newUserLogin.userLoginPasswordHash = await bcrypt.hash(registerDTO.userLoginPassword, newUserLogin.userLoginPasswordSalt);
        newUserLogin.userLoginEmailAddress = registerDTO.userLoginEmailAddress;

        newUserLogin = await this.userLoginRepository.save(newUserLogin);
        return newUserLogin;
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
}
