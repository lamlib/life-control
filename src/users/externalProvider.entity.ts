import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ExternalProvider {
    @PrimaryGeneratedColumn()
    externalProviderId: number;

    @Column()
    externalProviderName: string;

    @Column()
    externalProviderWSEndpoint: string;
}