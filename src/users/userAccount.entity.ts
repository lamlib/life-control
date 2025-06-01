import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { UserRole } from "./userRole.entity";
import { UserLogin } from "./userLogin.entity";

@Entity()
export class UserAccount {
    @PrimaryGeneratedColumn('increment', { type: 'int' })
    userAccountId: number;

    @Column({ type: 'varchar', length: 50 })
    userAccountFirstName: string;

    @Column({ type: 'varchar', length: 50 })
    userAccountLastName: string;

    @Column({ type: 'char', length: 1})
    userAccountGender: string;

    @Column({ type: 'date', })
    userAccountDateOfBirth: Date;

    @Column({ type: 'int' })
    userRoleId: number;

    @ManyToOne(() => UserRole, { nullable: false })
    @JoinColumn({ name: 'userRoleId' })
    userRole: UserRole;

    @OneToMany(() => UserLogin, userLogin => userLogin.userAccount)
    userLogins: UserLogin[];
}