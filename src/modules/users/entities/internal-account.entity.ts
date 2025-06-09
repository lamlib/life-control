import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Account } from "./account.entity";
import { HashingAlgorithm } from "../../auth/entities/hashing-algorithm.entity";
import { EmailStatus } from "./email-status.entity";

@Entity()
export class InternalAccount {
    @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
    username: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    passwordHash: string;

    @Column({ type: 'varchar', length: 128, nullable: false })
    passwordSalt: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    emailAdress: string;

    @Column({ type: 'varchar', length: 128, nullable: true })
    confirmationToken: string;

    @Column({ type: 'timestamp', nullable: true })
    confirmationTokenExpire: Date;

    @Column({ type: 'varchar', length: 128, nullable: true })
    passwordRecoveryToken: string;

    @Column({ type: 'timestamp', nullable: true })
    passwordRecoveryTokenExpire: Date;

    @PrimaryColumn({ type: 'int' })
    accountId: number;

    @Column({ type: 'int', nullable: true })
    hashingAlgorithmId: number;

    @Column({ type: 'int', nullable: true })
    emailStatusId: number;

    @ManyToOne(() => Account, { nullable: false })
    @JoinColumn({ name: 'accountId' })
    userAccount: Account;

    @ManyToOne(() => HashingAlgorithm, { nullable: false })
    @JoinColumn({ name: 'hashingAlgorithmId' })
    hashingAlgorithm: HashingAlgorithm;

    @ManyToOne(() => EmailStatus, { nullable: false })
    @JoinColumn({ name: 'emailStatusId' })
    emailStatus: EmailStatus;
}