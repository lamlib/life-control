import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./role.entity";
import { Permission } from "./permission.entity";

@Entity()
export class RolePermission {
    @PrimaryColumn({ type: 'int' })
    roleId: number;

    @PrimaryColumn({ type: 'int' })
    permissionId: number;

    @ManyToOne(() => Role, { nullable: false })
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @ManyToOne(() => Permission, { nullable: false })
    @JoinColumn({ name: 'permissionId' })
    permission: Permission;
}