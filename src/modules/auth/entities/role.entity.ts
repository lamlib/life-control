import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Account } from "../../users/entities/account.entity";
import { RolePermission } from "./role-permission.entity";

@Entity()
export class Role {
    @PrimaryGeneratedColumn('increment', { type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    description: string;

    @OneToMany(() => Account, account => account.roleId)
    accounts: Account[];

    @OneToMany(() => RolePermission, rolePermission => rolePermission.roleId)
    rolePermissions: RolePermission[];
}