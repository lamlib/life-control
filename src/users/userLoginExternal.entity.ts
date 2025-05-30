import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserLoginExternal {
    @PrimaryGeneratedColumn()
    userLoginExternalId: number;

    @Column()
    userAccountId: number;

    @Column()
    externalProviderId: number;

    @Column()
    externalProviderToken: string;
}