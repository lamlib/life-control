import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalAccount } from './entities/internal-account.entity';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from '../../modules/auth/dto/register.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { Request } from 'express';
import { EmailStatusEnum } from '../../common/enums/email-status.enum';
import { EmailStatus } from './entities/email-status.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Account)
    private readonly _accountRepository: Repository<Account>,

    @InjectRepository(InternalAccount)
    private readonly _internalAccountRepository: Repository<InternalAccount>,

    @InjectRepository(EmailStatus)
    private readonly _emailStatusRepository: Repository<EmailStatus>,
  ) {}

  async checkInternalAccount(loginDTO: LoginDto): Promise<InternalAccount> {
    const { emailAddress, password } = loginDTO;

    const internalAccount = await this._internalAccountRepository.findOneBy({
      emailAddress,
    });

    if (!internalAccount) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không hợp lệ');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      internalAccount.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không hợp lệ');
    }

    return internalAccount;
  }

  async findOneInternalAccountByAccountId(
    accountId: number,
  ): Promise<InternalAccount> {
    try {
      return await this._internalAccountRepository.findOneByOrFail({
        accountId,
      });
    } catch (error) {
      throw new NotFoundException('Tài khoản không tồn tại!');
    }
  }

  async saveInternalAccount(
    internalAccount: InternalAccount,
  ): Promise<InternalAccount> {
    return await this._internalAccountRepository.save(internalAccount);
  }

  async createInternalAccount(
    registerDTO: RegisterDTO,
    userRoleId: number,
  ): Promise<InternalAccount> {
    const { emailAddress, password } = registerDTO;
    const userLoginExisted = await this._internalAccountRepository.findOneBy({
      emailAddress,
    });

    if (userLoginExisted) {
      throw new Error(
        `User with email ${emailAddress} is existed, please using other email!`,
      );
    }

    // Tạo tài khoản
    let newAcc = new Account();
    newAcc.roleId = userRoleId;
    try {
      newAcc = await this._accountRepository.save(newAcc);
    } catch (error) {
      throw error;
    }

    // Tìm trạng thái chưa verify trong bảng.
    const status = await this._emailStatusRepository.findOneBy({
      id: EmailStatusEnum.UNVERIFIED,
    });

    // Tạo tài khoản internal
    let newInAcc = new InternalAccount();
    newInAcc.accountId = newAcc.id;
    newInAcc.passwordSalt = await bcrypt.genSalt();
    newInAcc.passwordHash = await bcrypt.hash(password, newInAcc.passwordSalt);
    newInAcc.emailAddress = emailAddress;
    newInAcc.emailStatusId = status!.id;
    newInAcc = await this._internalAccountRepository.save(newInAcc);

    // Lưu lại và trả về chính account đó.
    return newInAcc;
  }

  async findOneAccountById(accountId: number): Promise<Account> {
    const account = await this._accountRepository.findOneBy({ id: accountId });
    if (!account) {
      throw new NotFoundException();
    }
    return account;
  }
}
