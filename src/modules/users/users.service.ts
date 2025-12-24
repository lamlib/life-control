import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalAccount } from './entities/internal-account.entity';
import { ExternalAccount } from './entities/external-account.entity';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from '../../modules/auth/dto/register.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { Request } from 'express';
import { EmailStatusEnum } from '../../common/enums/email-status.enum';
import { EmailStatus } from './entities/email-status.entity';
import { ExternalProvider } from './entities/external-provider.entity';
import { RoleEnum } from 'src/common/enums/role.enum';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Account)
    private readonly _accountRepository: Repository<Account>,

    @InjectRepository(InternalAccount)
    private readonly _internalAccountRepository: Repository<InternalAccount>,

    @InjectRepository(ExternalAccount)
    private readonly _externalAccountRespository: Repository<ExternalAccount>,

    @InjectRepository(EmailStatus)
    private readonly _emailStatusRepository: Repository<EmailStatus>,

    @InjectRepository(ExternalProvider)
    private readonly _externalProviderRepository: Repository<ExternalProvider>,
  ) { }

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
      throw new ConflictException(
        `User with email ${emailAddress} is already existed, please using other email!`,
      );
    }

    // Tạo tài khoản
    let newAcc = new Account();
    newAcc.roleId = userRoleId;
    newAcc.username = emailAddress.split('@')[0];
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

  async findOneExternalProviderByName(name: string) {
    const provider = await this._externalProviderRepository.findOneBy({ name: name });
    if (!provider) {
      throw new NotFoundException();
    }
    return provider;
  }

  _generateUsername(emailAddress: string) {
    const randomSuffix = randomBytes(3).toString('hex');
    return `${emailAddress.split('@')[0]}_${randomSuffix}`;
  }

  async checkExternalAccount(externalProviderId: string, rawExaccount: {
    id: any;
    email: any;
    name: any;
    avatar: any;
  }) {
    let externalAccount = await this._externalAccountRespository.findOneBy({
      externalAccountId: rawExaccount.id,
      externalProviderId
    });

    if (!externalAccount) {
      let account = await this._accountRepository.findOneBy({
        emailAddress: rawExaccount.email
      });
      if (!account) {
        account = new Account();
        account.roleId = RoleEnum.CLIENT;
        account.emailAddress = rawExaccount.email;
        account.username = this._generateUsername(rawExaccount.email);
        try {
          account = await this._accountRepository.save(account);
        } catch (error) {
          throw error;
        }
      }

      externalAccount = await this._externalAccountRespository.save({
        accountId: account.id,
        externalAccountAvatar: rawExaccount.avatar,
        externalAccountEmailAdress: rawExaccount.email,
        externalAccountId: rawExaccount.id,
        externalAccountName: rawExaccount.name,
        externalProviderId: externalProviderId,
      });
    }
    return externalAccount;
  }
}
