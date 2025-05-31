import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserLogin } from "./userLogin.entity";
import { ExternalProvider } from "./externalProvider.entity";

@Entity()
export class UserLoginExternal {
    @PrimaryColumn({ type: 'int' })
    userAccountId: number;

    @PrimaryColumn({ type: 'int' })
    externalProviderId: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    externalProviderToken: string;

    @ManyToOne(() => UserLogin, userLogin => userLogin.externalLogins, { nullable: false })
    @JoinColumn({ name: 'userAccountId' })
    userLogin: UserLogin;

    @ManyToOne(() => ExternalProvider, { nullable: false })
    @JoinColumn({ name: 'externalProviderId' })
    externalProvider: ExternalProvider;
}