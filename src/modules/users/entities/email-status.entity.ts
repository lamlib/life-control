import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { InternalAccount } from './internal-account.entity';

@Entity()
export class EmailStatus {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  description: string;

  @OneToMany(
    () => InternalAccount,
    (internalAccount) => internalAccount.emailStatus,
  )
  internalAccounts: InternalAccount[];
}
