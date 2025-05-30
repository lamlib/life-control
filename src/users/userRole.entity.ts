import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserRole {
    @PrimaryGeneratedColumn()
    userEntityId: number;

    @Column()
    userRoleDescription: string;
}