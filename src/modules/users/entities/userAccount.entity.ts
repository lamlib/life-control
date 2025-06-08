import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { UserRole } from "../../auth/entities/userRole.entity";
import { UserLogin } from "./userLogin.entity";

@Entity()
export class UserAccount {
    @PrimaryGeneratedColumn()
    userAccountId: number;

    @Column({ type: 'varchar', length: 50, nullable: true, })
    userAccountFirstName: string;

    @Column({ type: 'varchar', length: 50, nullable: true, })
    userAccountLastName: string;

    @Column({ type: 'char', length: 1, nullable: true})
    userAccountGender: string;

    @Column({ type: 'date', nullable: true,})
    userAccountDateOfBirth: Date;

    @Column({ type: 'int', nullable: false })
    userRoleId: number;

    @ManyToOne(() => UserRole, { nullable: false })
    @JoinColumn({ name: 'userRoleId' })
    userRole: UserRole;

    @OneToMany(() => UserLogin, userLogin => userLogin.userAccount)
    userLogins: UserLogin[];
}