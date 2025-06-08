import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { UserAccount } from "../../users/entities/userAccount.entity";
import { UserRolePermission } from "./userRolePermission.entity";

@Entity()
export class UserRole {
    @PrimaryGeneratedColumn('increment', { type: 'int' })
    userRoleId: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    userRoleDescription: string;

    @OneToMany(() => UserAccount, userAccount => userAccount.userRole)
    userAccounts: UserAccount[];

    @OneToMany(() => UserRolePermission, rolePermission => rolePermission.userRole)
    rolePermissions: UserRolePermission[];
}