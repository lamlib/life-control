import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class HashingAlgorithm {
    @PrimaryGeneratedColumn()
    hashingAlgorithId: number;

    @Column()
    hashingAlgorithName: string;
}