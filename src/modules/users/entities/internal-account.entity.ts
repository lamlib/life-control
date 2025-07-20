import {
  Column,
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { Account } from './account.entity';
import { HashingAlgorithm } from '../../auth/entities/hashing-algorithm.entity';
import { EmailStatus } from './email-status.entity';

@Entity()
export class InternalAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  passwordHash: string;

  @Column({ type: 'varchar', length: 128, nullable: false })
  passwordSalt: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  emailAddress: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  confirmationToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  confirmationTokenExpire: Date | null;

  @Column({ type: 'varchar', length: 128, nullable: true })
  passwordRecoveryToken: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordRecoveryTokenExpire: Date;

  @Column({ nullable: false })
  accountId: number;

  @Column({ nullable: true })
  hashingAlgorithmId: number;

  @Column({ nullable: true })
  emailStatusId: number;

  @OneToOne(() => Account, { cascade: true })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @ManyToOne(() => HashingAlgorithm, { nullable: true })
  @JoinColumn({ name: 'hashingAlgorithmId' })
  hashingAlgorithm: HashingAlgorithm;

  @ManyToOne(() => EmailStatus, { nullable: true })
  @JoinColumn({ name: 'emailStatusId' })
  emailStatus: EmailStatus;
}
