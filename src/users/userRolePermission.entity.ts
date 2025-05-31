import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserRole } from "./userRole.entity";
import { UserPermission } from "./userPermission.entity";

@Entity()
export class UserRolePermission {
    @PrimaryColumn({ type: 'int' })
    userRoleId: number;

    @PrimaryColumn({ type: 'int' })
    userPermissionId: number;

    @ManyToOne(() => UserRole, userRole => userRole.rolePermissions, { nullable: false })
    @JoinColumn({ name: 'userRoleId' })
    userRole: UserRole;

    @ManyToOne(() => UserPermission, userPermission => userPermission.rolePermissions, { nullable: false })
    @JoinColumn({ name: 'userPermissionId' })
    userPermission: UserPermission;
}