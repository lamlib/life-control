import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EmailValidationStatus {
    @PrimaryGeneratedColumn()
    emailValidationStatusId: number;

    @Column()
    emailValidationStatusDescription: string;
}