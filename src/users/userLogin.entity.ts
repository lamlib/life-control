import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { UserAccount } from "./userAccount.entity";
import { HashingAlgorithm } from "../auth/hashingAlgorithm.entity";
import { EmailValidationStatus } from "./emailValidationStatus.entity";
import { UserLoginExternal } from "./userLoginExternal.entity";

@Entity()
export class UserLogin {
    @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
    userLoginName: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    userLoginPasswordHash: string;

    @Column({ type: 'varchar', length: 128, nullable: false })
    userLoginPasswordSalt: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    userLoginEmailAddress: string;

    @Column({ type: 'varchar', length: 128, nullable: true })
    userLoginConfirmationToken: string;

    @Column({ type: 'timestamp', nullable: true })
    userLoginTokenGenerationTime: Date;

    @Column({ type: 'varchar', length: 128, nullable: true })
    userLoginPasswordRecoveryToken: string;

    @Column({ type: 'timestamp', nullable: true })
    userLoginRecoveryTokenTime: Date;

    @PrimaryColumn({ type: 'int' })
    userAccountId: number;

    @Column({ type: 'int', nullable: true })
    hashingAlgorithmId: number;

    @Column({ type: 'int', nullable: true })
    emailValidationStatusId: number;

    @ManyToOne(() => UserAccount, userAccount => userAccount.userLogins, { nullable: false })
    @JoinColumn({ name: 'userAccountId' })
    userAccount: UserAccount;

    @ManyToOne(() => HashingAlgorithm, { nullable: false })
    @JoinColumn({ name: 'hashingAlgorithmId' })
    hashingAlgorithm: HashingAlgorithm;

    @ManyToOne(() => EmailValidationStatus, { nullable: false })
    @JoinColumn({ name: 'emailValidationStatusId' })
    emailValidationStatus: EmailValidationStatus;

    @OneToMany(() => UserLoginExternal, userLoginExternal => userLoginExternal.userLogin)
    externalLogins: UserLoginExternal[];
}