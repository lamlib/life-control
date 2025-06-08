import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TokenLogin {
    @PrimaryGeneratedColumn()
    tokenLoginId: number;

    @Column({ type: 'varchar', nullable: false })
    tokenLoginRefresh: string;

    @Column({ type: 'timestamp', nullable: false })
    tokenLoginRefreshExpire: Date;

    @Column({ type: 'int', nullable: false })
    userAccountId: number;
}