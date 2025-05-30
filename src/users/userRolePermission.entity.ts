import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserRolePermission {
    @PrimaryGeneratedColumn()
    userRolePermissionId: number;

    @Column()
    userRoleId: number;

    @Column()
    userPermissionId: number;
}