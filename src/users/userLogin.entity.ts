import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserLogin {
    @PrimaryGeneratedColumn()
    userLoginId: number;

    @Column()
    userLoginName: string;

    @Column()
    userLoginPasswordHash: string;

    @Column()
    userLoginPasswordSalt: string;

    @Column()
    userLoginEmailAdress: string;

    @Column()
    userLoginComfirmationToken: string;

    @Column()
    userLoginTokenGenerationTime: string;

    @Column()
    userLoginPasswordRecoveryToken: string;

    @Column()
    userLoginRecoveryTokenTime: string;

    @Column()
    userAccountId: number;

    @Column()
    hashingAlgorithmId: number;

    @Column()
    emailValidationStatusId: number;
}