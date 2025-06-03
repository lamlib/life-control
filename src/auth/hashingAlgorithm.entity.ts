import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { UserLogin } from "../users/userLogin.entity";

@Entity()
export class HashingAlgorithm {
    @PrimaryGeneratedColumn('increment', { type: 'int' })
    hashingAlgorithmId: number;

    @Column({ type: 'varchar', length: 20, unique: true })
    hashingAlgorithmName: string;

    @OneToMany(() => UserLogin, userLogin => userLogin.hashingAlgorithm)
    userLogins: UserLogin[];
}