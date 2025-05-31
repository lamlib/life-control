import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { UserLoginExternal } from "./userLoginExternal.entity";

@Entity()
export class ExternalProvider {
    @PrimaryGeneratedColumn('increment', { type: 'int' })
    externalProviderId: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    externalProviderName: string;

    @Column({ type: 'varchar', length: 255 })
    externalProviderWSEndpoint: string;

    @OneToMany(() => UserLoginExternal, userLoginExternal => userLoginExternal.externalProvider)
    userLogins: UserLoginExternal[];
}