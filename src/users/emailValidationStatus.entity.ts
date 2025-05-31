import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { UserLogin } from "./userLogin.entity";

@Entity()
export class EmailValidationStatus {
    @PrimaryGeneratedColumn('increment', { type: 'int' })
    emailValidationStatusId: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    emailValidationStatusDescription: string;

    @OneToMany(() => UserLogin, userLogin => userLogin.emailValidationStatus)
    userLogins: UserLogin[];
}