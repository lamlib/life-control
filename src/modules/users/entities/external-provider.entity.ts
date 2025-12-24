import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class ExternalProvider {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @CreateDateColumn()
  createAt: Date;

  @Column({ type: 'varchar', length: 255 })
  createBy: string;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({ type: 'varchar', length: 255 })
  updateBy: string;

  @DeleteDateColumn()
  deleteAt: Date;

  @Column({ type: 'varchar', length: 255 })
  deleteBy: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  clientId: string;

  @Column({ type: 'varchar', length: 255 })
  clientSecret: string;

  @Column({ type: 'varchar', length: 255 })
  authUrl: string;

  @Column({ type: 'varchar', length: 255 })
  tokenUrl: string;

  @Column({ type: 'varchar', length: 255 })
  userInfoUrl: string;

  @Column({ type: 'varchar', length: 255 })
  scope: string;

  @Column({ type: 'varchar', length: 255 })
  redirectUri: string;

  @Column({ type: 'varchar', length: 255 })
  enabled: string;
}
