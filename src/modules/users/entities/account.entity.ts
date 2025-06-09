import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Role } from "../../auth/entities/role.entity";
import { InternalAccount } from "./internal-account.entity";

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    accountId: number;

    @Column({ type: 'varchar', length: 50, nullable: true, })
    firstName: string;

    @Column({ type: 'varchar', length: 50, nullable: true, })
    lastName: string;

    @Column({ type: 'char', length: 1, nullable: true})
    gender: string;

    @Column({ type: 'date', nullable: true,})
    dateOfBirth: Date;

    @Column({ type: 'int', nullable: false })
    roleId: number;

    @ManyToOne(() => Role, { nullable: false })
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @OneToMany(() => InternalAccount, userLogin => userLogin.userAccount)
    internalAccounts: InternalAccount[];
}