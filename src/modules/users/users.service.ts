import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalAccount } from './entities/internal-account.entity';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
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
        @InjectRepository(InternalAccount)
        private userLoginRepository: Repository<InternalAccount>,
        @InjectRepository(Account)
        private userAccountRepository: Repository<Account>,
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
    async findAllUserAccount(): Promise<Account[]> {
        return this.userAccountRepository.find();
    }

    /**
     * Lấy ra một tài khoản của người dùng
     */
    async findOneUserAccount(accountId: number): Promise<Account> {
        const userAccount = await this.userAccountRepository.findOneBy({accountId: accountId});
        if(userAccount === null) {
            throw new Error("User is not exits");
        }
        return userAccount;
    }

    /**
     * Lấy ra một tài khoản đã login bằng tài khoản mật khẩu, nếu không có trả về null
     */
    async findOneUserLoginByEmailAdress(emailAdress: string): Promise<InternalAccount | null> {
        const userLogin = await this.userLoginRepository.findOneBy({ emailAdress });
        return userLogin;
    }

    async validateUserLoginPassword(emailAdress: string, userLoginPassword: string): Promise<InternalAccount | null> {
        const userLogin = await this.findOneUserLoginByEmailAdress(emailAdress);  
        if (!userLogin) {
            return null; // Không tìm thấy người dùng
        }
        const isPasswordValid = await bcrypt.compare(userLoginPassword, userLogin.passwordHash);
        if (!isPasswordValid) {
            return null; // Mật khẩu không hợp lệ
        }
        return userLogin; // Mật khẩu hợp lệ
    }

    /**
     * Tạo mới người dùng đăng nhập qua tài khoản mật khẩu, nếu đã tồn tại thì lỗi
     */
    async createUserLogin(registerDTO: RegisterDTO, userRoleId: number): Promise<InternalAccount> {
        const userLoginExisted = await this.findOneUserLoginByEmailAdress(registerDTO.emailAdress);

        if (userLoginExisted) throw new Error(`User with email ${registerDTO.emailAdress} is existed, please using other email!` )
        
        let newUserAccount = new Account();
        newUserAccount.roleId = userRoleId;
        newUserAccount = await this.userAccountRepository.save(newUserAccount);

        let newUserLogin = new InternalAccount();

        newUserLogin.accountId = newUserAccount.accountId;
        newUserLogin.passwordSalt = await bcrypt.genSalt();
        newUserLogin.passwordHash = await bcrypt.hash(registerDTO.userLoginPassword, newUserLogin.passwordSalt);
        newUserLogin.emailAdress = registerDTO.emailAdress;

        newUserLogin = await this.userLoginRepository.save(newUserLogin);
        return newUserLogin;
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
}
