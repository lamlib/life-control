import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ExternalProvider } from './external-provider.entity';
import { Account } from './account.entity';

@Entity()
export class ExternalAccount {
  @PrimaryColumn({ type: 'int' })
  externalProviderId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  externalProviderToken: string;

  @ManyToOne(() => Account, { nullable: false })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @ManyToOne(() => ExternalProvider, { nullable: false })
  @JoinColumn({ name: 'externalProviderId' })
  externalProvider: ExternalProvider;
}
