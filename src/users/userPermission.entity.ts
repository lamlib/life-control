import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { UserRolePermission } from "./userRolePermission.entity";

@Entity()
export class UserPermission {
    @PrimaryGeneratedColumn('increment', { type: 'int' })
    userPermissionId: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    userPermissionDescription: string;

    @OneToMany(() => UserRolePermission, rolePermission => rolePermission.userPermission)
    rolePermissions: UserRolePermission[];
}