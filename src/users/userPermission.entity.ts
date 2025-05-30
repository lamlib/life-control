import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserPermission {
    @PrimaryGeneratedColumn()
    userPermissionId: number;

    @Column()
    userPermissionDescription: string;
}