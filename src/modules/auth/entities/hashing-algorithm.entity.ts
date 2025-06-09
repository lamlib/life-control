import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { InternalAccount } from "../../users/entities/internal-account.entity";

@Entity()
export class HashingAlgorithm {
    @PrimaryGeneratedColumn('increment', { type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 20, unique: true })
    name: string;

    @OneToMany(() => InternalAccount, userLogin => userLogin.hashingAlgorithm)
    internalAccounts: InternalAccount[];
}