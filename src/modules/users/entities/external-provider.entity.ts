import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ExternalAccount } from "./external-account.entity";

@Entity()
export class ExternalProvider {
    @PrimaryGeneratedColumn('increment', { type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    endpoint: string;

    @OneToMany(() => ExternalAccount, externalAccount => externalAccount.externalProvider)
    externalAccounts: ExternalAccount[];
}