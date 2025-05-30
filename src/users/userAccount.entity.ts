import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserAccount {
    @PrimaryGeneratedColumn()
    userAccountId: number;

    @Column()
    userAccountFirstName: string;

    @Column()
    userAccountLastName: string;

    @Column()
    userAccountGender: string;

    @Column()
    userAccountDateOfBirth: string;
}