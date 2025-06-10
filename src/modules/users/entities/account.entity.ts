import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import { Role } from "../../auth/entities/role.entity";
import { InternalAccount } from "./internal-account.entity";

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, nullable: true, })
    firstName: string;

    @Column({ type: 'varchar', length: 50, nullable: true, })
    lastName: string;

    @Column({ type: 'char', length: 1, nullable: true})
    gender: string;

    @Column({ type: 'date', nullable: true,})
    dateOfBirth: Date;

    @PrimaryColumn({ type: 'int', nullable: false })
    roleId: number;

    @ManyToOne(() => Role, { nullable: false })
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @OneToMany(() => InternalAccount, userLogin => userLogin.userAccount)
    internalAccounts: InternalAccount[];
}